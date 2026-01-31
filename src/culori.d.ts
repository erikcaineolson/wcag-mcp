declare module "culori" {
  export interface Color {
    mode: string;
    r?: number;
    g?: number;
    b?: number;
    alpha?: number;
  }

  export function parse(color: string): Color | undefined;
  export function wcagContrast(color1: Color, color2: Color): number;
  export function formatHex(color: Color): string | undefined;
}
