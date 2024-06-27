import type Simulator from "./src/logic/simulator/simulator";

declare global {
    var editor: import("monaco-editor").editor.IStandaloneCodeEditor;
    var simulator: Simulator;
}