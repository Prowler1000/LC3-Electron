<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { ResizeObserver } from 'resize-observer'
    import { EditManager, InitGlobalMonaco } from "@/lib/editor";
    import { latestSnapshot, editorLoaded } from '@/lib/stores';

    export let editor: EditManager;

    let monacoReady = false;

    editor.monacoInitialized.subscribe(v => monacoReady = v);

    onMount(async () => {
        if (!monacoReady) {
            await editor.InitMonacoEditor();
        }
        else {
            let content = editor.value;
            latestSnapshot.set(content)
        }

        let eCtr = document.getElementById("editorCtr");
        if (eCtr) {
            eCtr.innerHTML = "";
            let monaco = editor.getMonacoContainer();
            eCtr.appendChild(monaco);
            let ro = new ResizeObserver(() => { resize() });
            ro.observe(eCtr);
            resize();
            editorLoaded.set(true);
        }
    });

    onDestroy(() => {
        editorLoaded.set(false);
    })

    function resize() {
        if(monacoReady) {
            editor.layoutMonaco();
        }
    }
</script>

<div id="editorCtr" role="grid" aria-label="Enable and disable tabbing out of editor with Ctrl+M on Windows and Linux or Ctrl+Shift+M on OSX" tabindex="0">
    <span class="loader"></span>
    <span class="sourceCodePro">Assembling application</span>
</div>

<style>
    #editorCtr{
        height: 67vh;
        width: inherit;
        display: grid;
        justify-items: center;
        align-items: center;
        overflow: hidden;
    }

    /* Courtesy of https://cssloaders.github.io/ for startup loader */
    .loader {
        width: 75px;
        height: 75px;
        position: relative;
        margin-bottom: -30vh;
        animation: rotate 1.5s ease-in infinite alternate;
    }
    .loader::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        color: var(--d-instr);
        background: currentColor;
        width: 64px;
        height: 32px;
        border-radius: 0 0 50px 50px;
    }
    .loader::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 10%;
        background: var(--d-dir);
        width: 8px;
        height: 64px;
        animation: rotate 1.2s linear infinite alternate-reverse;
    }

    @keyframes rotate {
        100% { transform: rotate(360deg)}
    }
</style>
