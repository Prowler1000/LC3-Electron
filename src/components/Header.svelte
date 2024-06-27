<script>
    import Menu from "./header/Menu.svelte";
    import Title from "./header/Title.svelte";
    import ThemeToggle from "./header/ThemeToggle.svelte";
    import { currentView, editorLoaded } from "@/lib/stores";
    import { onMount } from "svelte";

    // Set view-specific interface and controls
    let currView = "editor"
    currentView.subscribe(value => { currView = value });

    let editorReady = false
    editorLoaded.subscribe(value => { editorReady = value })
</script>

<div id="header" role="banner" aria-label="LC3-Electron top banner">
    <div id="header-inner" role="group" aria-labelledby="header">
        {#if editorReady}
            <Title subtitle="Read the {currView} guide" />
            <Menu {currView} />
            <ThemeToggle />
        {:else}
            <Title />
        {/if}
    </div>
</div>

<style>
    #header{
        overflow: auto;
        width: 100vw;
        height: 14vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #header-inner{
        height: 80%;
        width: 95%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    @media (max-width: 1200px) {
	    #header{
		    height: 20vh;
            max-height: 9em;
	    }
    }
</style>