<!-- 
    Workspace.svelte
        Workspace component including Editor and Simulator views and controls
-->

<script>
    import EditorView from '@/views/Editor.svelte';
    import SimulatorView from '@/views/Simulator.svelte';
    import { currentView } from '@/lib/stores'

    let currView = "editor"

    // Switch current view component
    currentView.subscribe(value => {
        currView = value
    });
</script>

<div id="workspace">
    <div id="workspace-inner">
        {#if currView == "editor"}
            <EditorView />
        {:else}
            <SimulatorView />
        {/if}
    </div>
</div>

<style>
    #workspace{
        margin-top: 5vh;
        width: 100vw;
        height: 80vh;
        display: flex;
        justify-content: center;
    }

    #workspace-inner{
        height: 90%;
        width: 90%;
    }

    @media (max-width: 900px) {
        #workspace{
            height: 100vh;
        }
    }
</style>