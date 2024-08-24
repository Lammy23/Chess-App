export const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

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
  white: "white",
  black: "black",
  toggleColor: (color) => {
    return color === "white" ? "black" : "white";
  },
  getLetter: (color) => {
    return color === "white" ? "w" : "b";
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
