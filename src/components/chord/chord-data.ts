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

const MJ_CC: Pick<ChordPhoto, "author" | "license"> = {
  author: "Mjchael",
  license: "CC BY-SA 3.0",
};

export const CHORDS: Record<string, ChordShape> = {
  Em: {
    name: "Em",
    baseFret: 1,
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    photo: {
      src: WM("Chord_Em.jpg"),
      page: WM_PAGE("Chord_Em.jpg"),
      ...MJ_CC,
    },
  },
  Am: {
    name: "Am",
    baseFret: 1,
    frets: ["x", 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    photo: {
      src: WM("Chord_Am.jpg"),
      page: WM_PAGE("Chord_Am.jpg"),
      ...MJ_CC,
    },
  },
  C: {
    name: "C",
    baseFret: 1,
    frets: ["x", 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    photo: {
      src: WM("Chord_C.jpg"),
      page: WM_PAGE("Chord_C.jpg"),
      ...MJ_CC,
    },
  },
  G: {
    name: "G",
    baseFret: 1,
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [3, 2, null, null, null, 4],
    photo: {
      src: WM("Chord_G.jpg"),
      page: WM_PAGE("Chord_G.jpg"),
      ...MJ_CC,
    },
  },
  D: {
    name: "D",
    baseFret: 1,
    frets: ["x", "x", 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    photo: {
      src: WM("Chord_D.jpg"),
      page: WM_PAGE("Chord_D.jpg"),
      ...MJ_CC,
    },
  },
  A: {
    name: "A",
    baseFret: 1,
    frets: ["x", 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    photo: {
      src: WM("Chord_A.jpg"),
      page: WM_PAGE("Chord_A.jpg"),
      ...MJ_CC,
    },
  },
  E: {
    name: "E",
    baseFret: 1,
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    photo: {
      src: WM("Accord_E_photo.jpg"),
      page: WM_PAGE("Accord_E_photo.jpg"),
      author: "Alexander Mikhalenko",
      license: "CC BY-SA 3.0",
    },
  },
  Dm: {
    name: "Dm",
    baseFret: 1,
    frets: ["x", "x", 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    photo: {
      src: WM("Re_minore_accordo_D_minor_chord.jpg"),
      page: WM_PAGE("Re_minore_accordo_D_minor_chord.jpg"),
      author: "Lucabon",
      license: "CC BY-SA 3.0",
    },
  },
  F: {
    name: "F (簡易)",
    baseFret: 1,
    frets: ["x", "x", 3, 2, 1, 1],
    fingers: [null, null, 3, 2, 1, 1],
    photo: {
      src: WM("Chord_F.jpg"),
      page: WM_PAGE("Chord_F.jpg"),
      ...MJ_CC,
    },
  },
};

export function getChord(name: string): ChordShape | undefined {
  return CHORDS[name];
}
