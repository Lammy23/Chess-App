export const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

// Hope this works 🤞
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