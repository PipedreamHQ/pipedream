// Map of numeric IDs to v1 API color names
const COLOR_MAP = {
  30: "berry_red",
  31: "red",
  32: "orange",
  33: "yellow",
  34: "olive_green",
  35: "lime_green",
  36: "green",
  37: "mint_green",
  38: "teal",
  39: "sky_blue",
  40: "light_blue",
  41: "blue",
  42: "grape",
  43: "violet",
  44: "lavender",
  45: "magenta",
  46: "salmon",
  47: "charcoal",
  48: "grey",
  49: "taupe",
};

// Reverse mapping
const COLOR_NAME_TO_ID = Object.fromEntries(
  Object.entries(COLOR_MAP).map(([
    id,
    name,
  ]) => [
    name,
    parseInt(id),
  ]),
);

// Helper functions
export function numericToString(numericColor) {
  return COLOR_MAP[numericColor] || null;
}

export function stringToNumeric(colorName) {
  return COLOR_NAME_TO_ID[colorName] || null;
}

// Original export for backward compatibility
export default [
  {
    label: "Berry Red",
    value: 30,
  },
  {
    label: "Red",
    value: 31,
  },
  {
    label: "Orange",
    value: 32,
  },
  {
    label: "Yellow",
    value: 33,
  },
  {
    label: "Olive Green",
    value: 34,
  },
  {
    label: "Lime Green",
    value: 35,
  },
  {
    label: "Green",
    value: 36,
  },
  {
    label: "Mint Green",
    value: 37,
  },
  {
    label: "Teal",
    value: 38,
  },
  {
    label: "Sky Blue",
    value: 39,
  },
  {
    label: "Light Blue",
    value: 40,
  },
  {
    label: "Blue",
    value: 41,
  },
  {
    label: "Grape",
    value: 42,
  },
  {
    label: "Violet",
    value: 43,
  },
  {
    label: "Lavender",
    value: 44,
  },
  {
    label: "Magenta",
    value: 45,
  },
  {
    label: "Salmon",
    value: 46,
  },
  {
    label: "Charcoal",
    value: 47,
  },
  {
    label: "Grey",
    value: 48,
  },
  {
    label: "Taupe",
    value: 49,
  },
];

export {
  COLOR_MAP,
  COLOR_NAME_TO_ID,
};
