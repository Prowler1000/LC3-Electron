import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import { derived, get, readonly, writable, type Writable } from 'svelte/store';

export class EditManager {
  private monaco: import('monaco-editor').editor.IStandaloneCodeEditor;

  // PRIVATE STORES
  private monacoReady = writable(false);
  private lastSavedVersionId = writable(0);
  private currentVersionId = writable(1);

  // PUBLIC READ-ONLY STORES
  public monacoInitialized = readonly(this.monacoReady);
  public filename = writable("untitled.asm");

  public async InitMonacoEditor() {
    this.monaco = await InitMonaco();
    this.monaco.getModel()?.onDidChangeContent(() => {this.onContentChange()});
    this.monacoReady.set(true);
  }

  public getMonacoContainer(): HTMLElement{
    return this.monaco.getContainerDomNode();
  }

  public layoutMonaco() {
    this.monaco.layout();
  }

  public hasUnsavedChanges = derived<[Writable<number>, Writable<number>], boolean>(
  [
    this.lastSavedVersionId,
    this.currentVersionId,
  ], ([oldId, currId], set) => { set(oldId !== currId); }
)

  // I REALLY DONT KNOW
  // #region

  /**
   * Opens a "Save as" dialog to select the location to save
   * the currently opened file, regardless of whether the user
   * is editing an existing file
   * @param defaultPath The default location to open the dialog to
   */
  public async saveAs(defaultPath?: string): Promise<boolean> {
    let result = await window.api.dialogs.saveAs(defaultPath, this.value, () => this.onSave());
    if (!result.cancelled) {
      this.compareNamePath(result.filePath);
    }
    return result.cancelled
  }

  private async onSave() {
    // Store the current version ID for detecting unsaved changes
    let model = this.monaco.getModel();
    if (model) {
      this.lastSavedVersionId.set(model.getAlternativeVersionId());
    }
  }

  //#endregion
  
  //  PRIVATE CLASS METHODS
  //  #region 

  private onContentChange() {
    let ver_id = this.monaco.getModel()?.getAlternativeVersionId();
    if (ver_id !== undefined) {
      this.currentVersionId.set(ver_id);
    }
  }


  private compareNamePath(fullpath: string) {
    // TODO:  Implement checking whether the save location and file name
    //        saved to during "saveAs" matches our current file name and path.
    //        If not, we need to set it to match as that's our new save target
    //        when saving without prompt
  }

  //#endregion


  //  GETTERS AND SETTERS
  //  #region
  
  get value(): string {
    return this.monaco?.getValue() || "";
  }

  //#endregion

}



async function InitMonaco() {
  let editor;
  let Monaco;

  self.MonacoEnvironment = {
      getWorker: function (_moduleId, label) {
        if (label === 'json') {
          return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
          return new tsWorker();
        }
        return new editorWorker();
      }
    };
  Monaco = await import("monaco-editor");

  Monaco.languages.register({
    id: 'lc3Asm'
  });

  Monaco.languages.setMonarchTokensProvider('lc3Asm', {
    defaultToken: "invalid",
    ignoreCase: true,

    instructions: [
      "add", "and", "br", "brn", "brz", "brp",
      "brnz", "brnp", "brzp", "brnzp", "jmp", "jsr",
      "jsrr", "ld", "ldi", "ldr", "lea", "not",
      "ret", "rti", "st", "sti", "str", "trap",

      // Likely ARM instructions, perhaps these should be separated
      "adc", "asr", "b",
      "beq", "bne", "bcs", "bcc", "bmi", "bpl", "bvs",
      "bvc", "bhi", "bls", "bge", "blt", "bgt", "ble",
      "bic", "bl", "bx", "cmn", "cmp", "eor", "ldmia",
      "ldrb", "ldrh", "lsl", "ldsb", "ldsh", "lsr", "mov",
      "mul", "mvn", "neg", "orr", "pop", "push", "ror",
      "sbc", "stmia", "strb", "strh", "sub", "tst", "swi",
    ],
    trapAliases: [
      "getc", "halt", "in", "out", "puts", "putsp"
    ],

    origDirective: [
      ".orig"
    ],

    directives: [
      ".end", ".fill", ".blkw", ".stringz",
      ".global", ".text", ".data",
    ],

    digits: /\d+/,
    binDigits: /[0-1]+/,
    hexDigits: /[0-9a-fA-F]+/,

    tokenizer: {
      root: [
          // numbers
          [/#?[xX](@hexDigits)/, "hexNumber"],
          [/#?[bB](@binDigits)/, "binNumber"],
          [/#?-?(@digits)/, "number"],

          // strings
          [/"([^"])*$/, "invalidString"],
          [/'([^'])*$/, "invalidString"],
          [/"/, "string", "@doubleString"],
          [/'/, "string", "@singleString"],

          // registers
          [/[rR][0-7]/, "register"],

          [/\.[\w]+/, {
              cases: {
                  "@origDirective": "orig",
                  "@directives": "directive",
                  "@default": "invalid"
              }
          }],

          // instructions and labels
          [/[a-zA-Z_][\w]*/, {
              cases: {
                  "@instructions": "instruction",
                  "@trapAliases": "trapAlias",
                  "@default": "label"
              }
          }],

          {include: "@whitespace"},

          // delimiter
          [/[,:]/, "delimiter"]
      ],

      whitespace: [
        [/\s/, ''],
        [/;.*$/, "comment"]
      ],

      doubleString: [
        [/[^"]+/, "string"],
        [/"/, "string", "@pop"]
      ],

      singleString: [
        [/[^']+/, "string"],
        [/'/, "string", "@pop"]
      ]
    }
  }) 
  // Define a new theme that contains only rules that match this language
  Monaco.editor.defineTheme('lc3Theme', {
    colors: {
      'editor.background': '2F2F2F'
    },
    base: 'vs-dark',
    inherit: false,
    rules: [
      { token: 'register', foreground: '8786CC' },
      { token: 'instruction', foreground: 'FFAB40' },
      { token: 'trapAlias', foreground: 'FFAB40' },
      { token: 'orig', foreground: 'F6F180' },
      { token: 'directive', foreground: '90D050'},
      { token: 'label', foreground: '60B6FF'},
      { token: 'number', foreground: 'CE608C'},
      { token: 'hexNumber', foreground: 'CE608C'},
      { token: 'binNumber', foreground: 'CE608C'},
      { token: 'delimiter', foreground: 'F0F0F0'},
      { token: 'invalidString', foreground: 'FF3724', fontStyle: 'bold'},
      { token: 'comment', foreground: '8F878C'},
      { token: 'string', foreground: '80B49A'},
      { token: 'invalid', foreground: 'C33333', fontStyle: 'bold'}
    ]
  });

  function getCode() {
      return [
          '; comment',
          '',
          '.orig x3000',
          '',
          '	lea R0, hello',
          '	puts',
          '	halt',
          '',
          'hello: .stringz "Hello World!\\n"',
          '.end'
      ].join('\n');
  }

  let container = document.getElementById('container');
  if (!container) {
    throw Error("Fatal error: Couldn't find element \"container\" when initializing editor")
  }
  editor = Monaco.editor.create(container, {
    theme: 'lc3Theme',
    value: getCode(),
    language: 'lc3Asm',
  })

  return editor
}

export async function InitGlobalMonaco() {
  globalThis.editor = await InitMonaco();
}