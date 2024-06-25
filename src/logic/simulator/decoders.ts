/**
 * Given a number, return a string representation of the ascii character it
 * represents, or an empty string otherwise.
 */
export class AsciiDecoder {
    private static ctrlCodes = new Map([
        [9, "'\\t'"],
        [10, "'\\n'"],
        [13, "'\\r'"]
    ]);

    static decode(code: number): string {
        // printable ascii codes, ' ' to '~'
        if (code >= 32 && code < 127) {
            return "'" + String.fromCharCode(code) + "'";
        }
        // if there's a control code for it, return that. Otherwise return ""
        else {
            const seq  = this.ctrlCodes.get(code);
            return typeof(seq) === "undefined" ? "" : seq;
        }
    }
}

/**
 * Decode the index of a register in an instruction
 * @param instruction the instruction to decode
 * @param position one of three positions, numbered left-to-right (0, 1, 2)
 * @returns decoded register number
 */
export function decodeRegister(instruction: number, position: number): number {
    let shift: number;
    switch (position) {
        case 0:
            shift = 9;
            break;
        case 1:
            shift = 6;
            break;
        default:
            shift = 0;
            break;
    }
    return (instruction >> shift) & 0b111;
}

/**
 * Decode an immediate operand in an instruction (including PC offsets)
 * @param instruction the instruction to decode
 * @param length the length, in bits, of the immediate operand
 * @returns the immediate value, sign-extended to 16 bits
 */
export function decodeImmediate(instruction: number, length: number): number {
    let mask = 0x0fff;
    let sign = 0xf800;
    for (let remaining = 12 - length; remaining > 0; --remaining) {
        mask >>= 1;
        sign = (sign >> 1) | 0x8000;
    }
    // isolate immediate value
    let result = instruction & mask;
    // sign-extend to 16 bits
    if ((result & sign) != 0) {
        result |= sign;
    }
    return result;
}
