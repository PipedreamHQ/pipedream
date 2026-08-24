import { ConfigurationError } from "@pipedream/platform";

const HEX_COLOR = /^#?([0-9a-fA-F]{6})$/;

// Points are what the Slides UI shows, so every measurement prop is in PT even
// though `Dimension` also accepts EMU.
const POINTS = "PT";

// Parse `#RRGGBB` into the API's `RgbColor`, whose channels are floats in [0, 1]
// rather than the 0-255 bytes users think in. Returns `undefined` when unset so
// callers can hand it straight to `set()` and have it skipped.
function rgbColor(hex, label) {
  if (hex === undefined || hex === null || hex === "") {
    return undefined;
  }
  const match = HEX_COLOR.exec(String(hex).trim());
  if (!match) {
    throw new ConfigurationError(`${label} must be a 6-digit hex color such as \`#FF0000\`, got \`${hex}\`.`);
  }
  const int = parseInt(match[1], 16);
  return {
    red: ((int >> 16) & 255) / 255,
    green: ((int >> 8) & 255) / 255,
    blue: (int & 255) / 255,
  };
}

// Slides wraps color differently depending on the field. Text style takes an
// `OptionalColor` (`{opaqueColor: {rgbColor}}`); fills take a `SolidFill`
// (`{color: {rgbColor}, alpha}`). Both are built from the same parsed channels.
function optionalColor(hex, label) {
  const rgb = rgbColor(hex, label);
  if (!rgb) {
    return undefined;
  }
  return {
    opaqueColor: {
      rgbColor: rgb,
    },
  };
}

function solidFill(hex, alpha, label) {
  const rgb = rgbColor(hex, label);
  if (!rgb) {
    return undefined;
  }
  const fill = {
    color: {
      rgbColor: rgb,
    },
  };
  if (alpha !== undefined && alpha !== null && alpha !== "") {
    const value = Number(alpha);
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new ConfigurationError(`${label} Opacity must be a number between 0 and 1, got \`${alpha}\`.`);
    }
    fill.alpha = value;
  }
  return fill;
}

// Wrap a numeric point value in a `Dimension`, passing `undefined` through so an
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

// Build a style object together with the `fields` mask that has to accompany it.
// batchUpdate only touches properties named in the mask, so the mask must list
// exactly what the user set — naming a key they left blank would reset that
// property to its default. Paths may be dotted (`outline.weight`), which is how
// the API scopes a mask to one part of a nested property.
//
// `false` and `0` are kept: unbolding text and zeroing an outline are real edits.
function styleBuilder() {
  const style = {};
  const fields = [];
  return {
    set(path, value) {
      if (value === undefined || value === null || value === "") {
        return;
      }
      const keys = path.split(".");
      const last = keys.pop();
      let node = style;
      for (const key of keys) {
        if (node[key] === undefined) {
          node[key] = {};
        }
        node = node[key];
      }
      node[last] = value;
      fields.push(path);
    },
    result() {
      return {
        style,
        fields: fields.join(","),
        isEmpty: fields.length === 0,
      };
    },
  };
}

// A `Range` over a shape's or table cell's text. `ALL` ignores the indices;
// `FROM_START_INDEX` runs to the end; `FIXED_RANGE` needs both.
function buildTextRange(type, startIndex, endIndex) {
  if (type === "ALL") {
    return {
      type,
    };
  }
  const start = Number(startIndex);
  if (!Number.isInteger(start) || start < 0) {
    throw new ConfigurationError(`Start Index must be an integer of 0 or more when Range Type is \`${type}\`.`);
  }
  if (type === "FROM_START_INDEX") {
    return {
      type,
      startIndex: start,
    };
  }
  const end = Number(endIndex);
  if (!Number.isInteger(end)) {
    throw new ConfigurationError("End Index must be an integer when Range Type is `FIXED_RANGE`.");
  }
  if (end <= start) {
    throw new ConfigurationError(`End Index (\`${end}\`) must be greater than Start Index (\`${start}\`).`);
  }
  return {
    type,
    startIndex: start,
    endIndex: end,
  };
}

// Text inside a table lives in a cell, so these requests take an extra
// `cellLocation`. Row and column have to arrive together.
function buildCellLocation(rowIndex, columnIndex) {
  const hasRow = rowIndex !== undefined && rowIndex !== null && rowIndex !== "";
  const hasColumn = columnIndex !== undefined && columnIndex !== null && columnIndex !== "";
  if (hasRow !== hasColumn) {
    throw new ConfigurationError("Set both Row Index and Column Index to target a table cell, or leave both blank when the target is a shape.");
  }
  if (!hasRow) {
    return undefined;
  }
  return {
    rowIndex: Number(rowIndex),
    columnIndex: Number(columnIndex),
  };
}

export default {
  rgbColor,
  optionalColor,
  solidFill,
  points,
  styleBuilder,
  buildTextRange,
  buildCellLocation,
};
