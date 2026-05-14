export type ChordPhoto = {
  src: string;
  page: string;
  author: string;
  license: string;
};

export type ChordShape = {
  name: string;
  baseFret: number;
  frets: Array<number | "x">;
  fingers?: Array<number | null>;
  photo?: ChordPhoto;
};

const WM = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=400`;

const WM_PAGE = (filename: string) =>
  `https://commons.wikimedia.org/wiki/File:${filename}`;

const MIKHALENKO: Pick<ChordPhoto, "author" | "license"> = {
  author: "Alexander Mikhalenko",
  license: "CC BY-SA 3.0",
};

function makePhoto(filename: string): ChordPhoto {
  return {
    src: WM(filename),
    page: WM_PAGE(filename),
    ...MIKHALENKO,
  };
}

export const CHORDS: Record<string, ChordShape> = {
  Em: {
    name: "Em",
    baseFret: 1,
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    photo: makePhoto("Accord_Em_photo.jpg"),
  },
  Am: {
    name: "Am",
    baseFret: 1,
    frets: ["x", 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    photo: makePhoto("Accord_Am_photo.jpg"),
  },
  C: {
    name: "C",
    baseFret: 1,
    frets: ["x", 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    photo: makePhoto("Accord_C_photo.jpg"),
  },
  G: {
    name: "G",
    baseFret: 1,
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [3, 2, null, null, null, 4],
    photo: makePhoto("Accord_G_photo.jpg"),
  },
  D: {
    name: "D",
    baseFret: 1,
    frets: ["x", "x", 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    photo: makePhoto("Accord_D_photo.jpg"),
  },
  A: {
    name: "A",
    baseFret: 1,
    frets: ["x", 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    photo: makePhoto("Accord_A_photo.jpg"),
  },
  E: {
    name: "E",
    baseFret: 1,
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    photo: makePhoto("Accord_E_photo.jpg"),
  },
  Dm: {
    name: "Dm",
    baseFret: 1,
    frets: ["x", "x", 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    photo: makePhoto("Accord_Dm_photo.jpg"),
  },
  F: {
    name: "F (簡易)",
    baseFret: 1,
    frets: ["x", "x", 3, 2, 1, 1],
    fingers: [null, null, 3, 2, 1, 1],
    photo: makePhoto("Accord_F_photo.jpg"),
  },
};

export function getChord(name: string): ChordShape | undefined {
  return CHORDS[name];
}
