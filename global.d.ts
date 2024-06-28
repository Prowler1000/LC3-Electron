import type Simulator from "./src/logic/simulator/simulator";

declare global {
    var editor: import("monaco-editor").editor.IStandaloneCodeEditor;
    var simulator: Simulator;
    var objFile: Blob | null;
    var symbolTable: Blob | null;
    var lastBps: number[] | null;
    var lastPtr: number | null;
}