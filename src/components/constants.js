export const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const startingChessPosition = {
  // Hashmap representing starting positions, will update every position for each piece when moved
  a1: "rook_w",
  b1: "knight_w",
  c1: "bishop_w",
  d1: "queen_w",
  e1: "king_w",
  f1: "bishop_w",
  g1: "knight_w",
  h1: "rook_w",
  a2: "pawn_w",
  b2: "pawn_w",
  c2: "pawn_w",
  d2: "pawn_w",
  e2: "pawn_w",
  f2: "pawn_w",
  g2: "pawn_w",
  h2: "pawn_w",
  a7: "pawn_b",
  b7: "pawn_b",
  c7: "pawn_b",
  d7: "pawn_b",
  e7: "pawn_b",
  f7: "pawn_b",
  g7: "pawn_b",
  h7: "pawn_b",
  a8: "rook_b",
  b8: "knight_b",
  c8: "bishop_b",
  d8: "queen_b",
  e8: "king_b",
  f8: "bishop_b",
  g8: "knight_b",
  h8: "rook_b",
};

// Hope this works 🤞 me too
export const allChessCoordinates = files.reduce((acc, file) => {
  ranks.forEach((rank) => {
    acc.push(`${file}${rank}`);
  });
  return acc;
}, []);

export const numToFile = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
  6: "f",
  7: "g",
  8: "h",
};

export const Color = {
  white: "White",
  black: "Black",
  toggleColor: (color) => {
    return color === "White" ? "Black" : "White";
  },
  getLetter: (color) => {
    return color === "White" ? "w" : "b";
  },
};

/**
 * Function to compare two objects deeply
 * @param {object} obj1
 * @param {object} obj2
 * @returns {boolean}
 */
export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export const soundFiles = {
  "undo-redo": "chesss",
};
