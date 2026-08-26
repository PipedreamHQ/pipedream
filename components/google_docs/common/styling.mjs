import { ConfigurationError } from "@pipedream/platform";

const HEX_COLOR = /^#?([0-9a-fA-F]{6})$/;

// Google's `Dimension` unit for every measurement these actions accept. The API
// also allows EMU, but points are what the Docs UI shows, so props are in PT.
const POINTS = "PT";

// Convert a `#RRGGBB` string into the `OptionalColor` shape batchUpdate expects,
// whose channels are floats in [0, 1] rather than the 0-255 bytes users think in.
// Returns `undefined` for an unset prop so callers can pass it straight through.
function optionalColor(hex, label) {
  if (hex === undefined || hex === null || hex === "") {
    return undefined;
  }
  const match = HEX_COLOR.exec(String(hex).trim());
  if (!match) {
    throw new ConfigurationError(`${label} must be a 6-digit hex color such as \`#FF0000\`, got \`${hex}\`.`);
  }
  const int = parseInt(match[1], 16);
  return {
    color: {
      rgbColor: {
        red: ((int >> 16) & 255) / 255,
        green: ((int >> 8) & 255) / 255,
        blue: (int & 255) / 255,
      },
    },
  };
}

// Wrap a numeric point value in a `Dimension`. Passes `undefined` through so an
// omitted prop stays out of the field mask instead of being sent as a zero.
function points(magnitude) {
  if (magnitude === undefined || magnitude === null || magnitude === "") {
    return undefined;
  }
  const value = Number(magnitude);
  if (!Number.isFinite(value)) {
    throw new ConfigurationError(`Expected a number of points, got \`${magnitude}\`.`);
  }
  return {
    magnitude: value,
    unit: POINTS,
  };
}

// Build a style object alongside the `fields` mask that must accompany it.
// batchUpdate only touches properties named in the mask, so the mask has to list
// exactly the keys the user actually set — sending a key the user left blank
// would reset that property to its default. `false` and `0` are kept, since
// unbolding text and zeroing an indent are both real edits.
function buildStyle(spec) {
  const style = {};
  const fields = [];
  for (const key of Object.keys(spec)) {
    const value = spec[key];
    if (value === undefined || value === null || value === "") {
      continue;
    }
    style[key] = value;
    fields.push(key);
  }
  return {
    style,
    fields: fields.join(","),
    isEmpty: fields.length === 0,
  };
}

// A `Range` over the document body, optionally scoped to a single tab.
function buildRange(startIndex, endIndex, tabId) {
  const start = Number(startIndex);
  const end = Number(endIndex);
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new ConfigurationError("Start Index and End Index must both be integers.");
  }
  if (start < 1) {
    throw new ConfigurationError(`Start Index must be at least 1, got \`${start}\`. Index 0 is the document root and cannot be styled.`);
  }
  if (end <= start) {
    throw new ConfigurationError(`End Index (\`${end}\`) must be greater than Start Index (\`${start}\`).`);
  }
  const range = {
    startIndex: start,
    endIndex: end,
  };
  if (tabId) {
    range.tabId = tabId;
  }
  return range;
}

export default {
  optionalColor,
  points,
  buildStyle,
  buildRange,
};
