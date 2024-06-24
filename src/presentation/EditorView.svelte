<!--
	EditorView.svelte
		This workspace view enables a client to write assembly programs through an Editor,
		assemble and generate .obj files for Simulator use, and view assembly status and errors through a Console
-->

<script>
	import Editor from "./Editor.svelte"
	//import Console from "./Console.svelte"
	//import SimulatorStatus from "./SimulatorStatus.svelte"
	import { onMount } from 'svelte'
	//import { openedFile, currentView, assembledFile } from './stores'
	//import Assembler from "../logic/assembler/assembler"
	//import ARMAssembler from "../logic/assembler/armAssembler"
	//import Simulator from "../logic/simulator/simulator";
</script>

<div id="editor-view" role="group" aria-label="Editor workspace">
	<!-- Initially hide Editor contents while application loads -->
	<section id="ev-right">
		<div class="filler">filler</div>
		<div id="console-ctr" role="grid" aria-label="Console output to show assembly errors and success" tabindex="0">
			
		</div>
		<div id="ev-buttons">
			<div id="ss-ctr"></div>
			<button id="assemble" class="functionBtn" aria-label="Assemble the program" tabindex="0">
				<span class="material-symbols-outlined">memory</span>
				ASSEMBLE
			</button>
			<button class="switchBtn" tabindex="0">
				Switch to Simulator
			</button>
		</div>

	</section>
	<section id="ev-left">
		<div id="filename" class="workSans" role="button" aria-label="Click to rename workspace file" tabindex="0">
		</div>
		<Editor />
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
		font-size: 15px;
		width: max-content;
		min-width: 50%;
		margin-bottom: 2vh;
		text-align: center;
		cursor: pointer;
		visibility: hidden;
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