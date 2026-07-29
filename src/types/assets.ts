export interface Creator {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Background {
  id: string;
  label: string;
  imageUrl: string;
  isActive: boolean;
}

export interface Frame {
  id: string;
  label: string;
  imageUrl: string;
  isActive: boolean;
}

export interface TextLayer {
  text: string;
  /** Normalized 0-1 position within the canvas, independent of export resolution. */
  xNorm: number;
  yNorm: number;
}
