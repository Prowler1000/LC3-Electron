<!--
	EditorView.svelte
		This workspace view enables a client to write assembly programs through an Editor,
		assemble and generate .obj files for Simulator use, and view assembly status and errors through a Console
-->

<script lang="ts">
	import Editor from "@/components/editor/Editor.svelte";
	import Console from "@/components/editor/Console.svelte";
	import SimulatorStatus from "@/components/editor/SimulatorStatus.svelte";
	import { openedFile, currentView, assembledFile } from "@/lib/stores"
	import Assembler from "@/logic/assembler/lc3/assembler";
	//import ARMAssembler from "../logic/assembler/armAssembler"
	import Simulator from "@/logic/simulator/simulator";
	import { onMount } from 'svelte'
  	import type { EditManager } from "@/lib/editor";
	
	const LC3_EXTENSION = "asm"
	const ARM_EXTENSION = "s"

	export let editor: EditManager;
	// Current .asm program filename
	export let filename = "untitled.asm"

	let appLoadComplete = false
	onMount(() => {
		editor.filename.subscribe((value) => {
			filename = value;
			(document.getElementById("filename") as HTMLTextAreaElement).value = value;

		});
		appLoadComplete = true
	});


	/* EDITOR AND FILE STATE MANAGEMENT */

	// Switch the simulator view on button click
	function toSimulator() { currentView.set("simulator") }
	// Stifle other functions from firing if input is open
	let inputOpen = false

	// Set filename of assembled .obj file, replacing .asm extension
	function setObjFilename(){
		assembledFile.set(filename.substring(0,filename.length-(getExtension().length+1))+".obj")
	}

	// Returns the currently open file's extension
	function getExtension(): "s" | "asm" {
		let tokens = filename.split(".");
		let filetype = tokens[tokens.length - 1]
		if (filetype !== "s" && filetype !== "asm")
			throw Error("Unhandled exception. File extension does not match required extensions of \"s\" or \"asm\".")
		return filetype
	}

	/* ASSEMBLY */

	// Assemble program
	async function assembleClick(){
		let sourceCode = editor.value
		let obj;

		if (getExtension() === LC3_EXTENSION)
			obj = await Assembler.assemble(sourceCode)
		else if (getExtension() === ARM_EXTENSION)
			obj = null //await ARMAssembler.assemble(sourceCode)
		else
			alert(`File ${filename} could not be assembled due to invalid extension. WebLC3 only accepts .asm and .s files.`);

		if(obj){
			// Create globally-available Simulator class
			let map = obj.pop()
			if (!map) {
				throw Error("Map not defined. Source code assembly failed.")
			}
			if (map instanceof Uint16Array) {
				throw Error("Trying to pass Uint16Array to simulator as source code.")
			}
			// Clean up existing simulator. "Temporary" fix :)
			if (globalThis.simulator) {
				globalThis.simulator.destroy();
			}
			globalThis.simulator = new Simulator(obj[0], map, getExtension())
			globalThis.lastPtr = null
			globalThis.lastBps = null

			// Globally store .obj file, and symbol table file blobs
			if(globalThis.simulator){
				setObjFilename()

				if (getExtension() === LC3_EXTENSION)
				{
					globalThis.objFile = Assembler.getObjectFileBlob()
					globalThis.symbolTable = Assembler.getSymbolTableBlob()
				}
				else if (getExtension() === ARM_EXTENSION)
				{
					//globalThis.objFile = ARMAssembler.getObjectFileBlob()
					//globalThis.symbolTable = ARMAssembler.getSymbolTableBlob()
				}
			}
		}
	}

	function filenameOnInput(event: Event & { currentTarget: EventTarget & HTMLTextAreaElement; }) {
		event.currentTarget.value = event.currentTarget.value.replace(/\n/g, '');
	}

	function filenameOnBlur(event: Event & { currentTarget: EventTarget & HTMLTextAreaElement; }) {
		let value = event.currentTarget.value
		if (value.length === 0) {
			value = "untitled.asm";
		}
		else if (!value.endsWith(".asm") && !value.endsWith(".s")) {
			value += ".asm";
		}
		if (value === filename) {
			// Subscribe functions won't be called, we need to set things here
			event.currentTarget.value = value;
		}
		editor.filename.set(value);
	}

	function filenameKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement; }) {
		if (e.key === "Enter") {
			e.currentTarget.blur();
		}
	}

</script>

<div id="editor-view" role="group" aria-label="Editor workspace">
	<!-- Initially hide Editor contents while application loads -->
	{#if appLoadComplete}
	<section id="ev-right">
		<div class="filler">filler</div>
		<div id="console-ctr" role="grid" aria-label="Console output to show assembly errors and success" tabindex="0">
			<Console />
		</div>
		<div id="ev-buttons">
			<div id="ss-ctr"><SimulatorStatus /></div>
			<button id="assemble" class="functionBtn" on:click={assembleClick} aria-label="Assemble the program" tabindex="0">
				<span class="material-symbols-outlined">memory</span>
				ASSEMBLE
			</button>
			<button class="switchBtn" on:click={toSimulator} tabindex="0">
				Switch to Simulator
			</button>
		</div>

	</section>
	{/if}
	<section id="ev-left">
		<textarea id="filename" class="workSans" rows="1"
			on:input={filenameOnInput}
			on:keydown={filenameKeydown}
			on:blur={filenameOnBlur}
		></textarea>
		<Editor {editor} />
	</section>
</div>

<style>
	#editor-view{
		height: inherit;
		min-height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
	}

	#filename{
		width: auto;
		border: none;
		border-radius: 4px;
		padding: 10px;
		resize: none;
		overflow: hidden;
		text-align: center;
		font-size: 15px;
		background: none;
	}

	.filler{
		font-size: 15px;
		margin-bottom: 2vh;
		opacity: 0;
	}

	#ev-left, #ev-right{
		height: inherit;
		min-height: 100%;
		width: 100%;
		display: grid;
	}

	#ev-left{
		grid-template-rows: auto 1fr;
		justify-items: center;
		width: 100%;
	}

	#ev-right{
		grid-template-rows: auto 1fr auto;
		width: 28%;
		margin-left: 5%;
	}

	#console-ctr{
		max-height: 41vh;
	}

	#ev-buttons{
		margin-top: 2vh;
	}

	#ss-ctr{
		margin-bottom: 4vh;
		overflow: visible;
		max-width: 18vw;
	}

	.functionBtn, .switchBtn{
		width: 100%;
		padding: 0.8em 0 0.8em 0;
		margin-top: 1vh;
		text-align: center;
	}

	@media (max-width: 1300px) {
		.functionBtn{
			font-size: 18px !important;
		}

		#editor-view{
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: max-content 100vh;
		}

		#ev-right{
			grid-row: 2/3;
			width: 100%;
			grid-template-rows: auto 60vh 18% 0.8fr;
			margin-bottom: 20vh;
			margin-left: 0;
		}

		#console-ctr{
			max-height: 95%;
		}

		#ev-buttons{
			display: grid;
			width: 100%;
			grid-template-columns: auto 40vw;
			grid-template-rows: auto 6.5em;
			justify-items: flex-end;
		}

		#ev-buttons button{
			width: 90%;
		}

		#ss-ctr{
			margin: 1vh 5% 4vh 0;
			transform: scale(1.1);
			width: 25%;
			grid-column: 1/3;
			justify-self: center;
		}
	}

	@media (max-width: 600px) {
		.functionBtn{
			font-size: 14px !important;
		}

		.switchBtn{
			font-size: 12px !important;
		}
	}
</style>