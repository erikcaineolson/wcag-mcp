declare module "culori" {
  export interface Color {
    mode: string;
    [channel: string]: number | string | undefined;
  }

  export function parse(color: string): Color | undefined;
  export function wcagContrast(foreground: Color, background: Color): number;
  export function formatHex(color: Color): string;
}
