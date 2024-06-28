  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

export async function InitMonacoEditor() {
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

      globalThis.editor = editor;
}