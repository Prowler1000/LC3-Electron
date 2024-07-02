<script lang="ts">
    import { onMount } from "svelte"
    import { reloadOverride } from '@/lib/stores'
    import type { EditManager } from "@/lib/editor";
    
    export let currView = "editor"
    export let editor: EditManager;

    let unsavedChanges = false;
    editor.hasUnsavedChanges.subscribe(val => unsavedChanges = val);

    export let readOnly = false

    /* EDITOR MENU CONTROLS */

    // New: Reset Editor and filename
    function newClick(doSave?: boolean){
        if (readOnly) return;
        if (unsavedChanges && doSave === undefined) {
            let dialog = document.querySelector("dialog");
            dialog?.showModal();
        }
        else {
            // (this asserts that doSave is defined, not that it's false)
            editor.reset(unsavedChanges && doSave!);
        }
    }
    
    // Open: Open an existing .asm file and load content to Editor
    async function openClick(){
        if (readOnly) return;
        await editor.open();
    }

    // Save: Save Editor content as .asm or .s file to client's local filesystem
    async function saveClick(){
        if (readOnly) return;
        await editor.saveAs();
    }

    /* SIMULATOR MENU CONTROLS */

    // Reload: Load code into memory, set PC to start of program, restore Processor Status Register to defaults, set clock-enable
    function reloadClick(){
        if (readOnly) return;
        if(globalThis.simulator){
            globalThis.simulator.reloadProgram()
            reloadOverride.set([true,true])
        }
    }

    // Reinitialize: Set all of memory to zeroes except for operating system code
    function reinitializeClick(){
        if (readOnly) return;
        if(globalThis.simulator){
            globalThis.simulator.resetMemory()
            reloadOverride.set([true,false])
        }
    }

    // Randomize: Randomize all of memory except for operating system code
    function randomizeClick(){
        if (readOnly) return;
        if(globalThis.simulator){
            globalThis.simulator.randomizeMemory()
            reloadOverride.set([true,false])
        }
    }
</script>

<div id="menu" class="workSans" role="menubar" aria-label="Editor and simulator work controls">
    <dialog>
        <p>You have unsaved changes. Would you like to save them now?</p>
        <form method="dialog">
            <button>Cancel</button>
            <button on:click={() => newClick(false)}>No</button>
            <button on:click={() => newClick(true)}>Yes</button>
        </form>
    </dialog>
    {#if currView == "editor"}
        <button id="new" class="menu-item" on:click={() => newClick()} role="menuitem" aria-label="Start new file">
            <span class="material-symbols-outlined">note_add</span>
            <p>New</p>
        </button>
        <button id="open" class="menu-item" on:click={() => openClick()} role="menuitem" aria-label="Open assembly file from device">
            <span class="material-symbols-outlined">folder</span>
            <p>Open</p>
        </button>
        <button id="save" class="menu-item" on:click={() => saveClick()} role="menuitem" aria-label="Save file to device">
            <span class="material-symbols-outlined">save</span>
            {#if unsavedChanges}
            <p>Save</p>
            {:else}
            <p>Saved</p>
            {/if}
        </button>
    {:else}
        <button id="reload" class="menu-item" on:click={() => reloadClick()} role="menuitem" aria-label="Reload simulator">
            <span class="material-symbols-outlined">refresh</span>
            <p>Reload</p>
        </button>
        <button id="reinitialize" class="menu-item" on:click={() => reinitializeClick()} role="menuitem" aria-label="Reinitialize simulator">
            <span class="material-symbols-outlined">power_settings_new</span>
            <p>Reinitialize</p>
        </button>
        <button id="randomize" class="menu-item" on:click={() => randomizeClick()} role="menuitem" aria-label="Randomize simulator">
            <span class="material-symbols-outlined">shuffle</span>
            <p>Randomize</p>
        </button>
    {/if}
</div>

<style>
    #menu{
        height: 80%;
        display: grid;
        grid-template-columns: 4.5em 4.5em 4.5em;
        grid-column-gap: 0.4em;
    }

    .menu-item{
        padding: unset;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 15px;
    }

    .menu-item span{
        font-size: 25px;
        margin-bottom: 8%;
    }

    .menu-item p{
        width: 80%;
        text-align: center;
        letter-spacing: 1px;
        font-size: 9px;
        margin: 0;
    }

    @media (max-width: 1200px) {
	    .menu-item span{
            font-size: 20px;
        }
    }

    @media (max-width: 900px) {
	    #menu{
            grid-template-columns: 6em 6em 6em;
            grid-column-gap: 0.7em;
        }
    }

    @media (max-width: 600px) {
        #menu{
            grid-template-columns: 4.5em 4.5em 4.5em;
            grid-column-gap: 0.4em;
        }
    }
</style>