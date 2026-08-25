import { ConfigurationError } from "@pipedream/platform";
import {
  TEXT_RANGE_ALL,
  TEXT_RANGE_FIXED_RANGE,
  OPACITY_SCALE,
  TEXT_RANGE_FROM_START_INDEX,
  THEME_COLORS,
} from "./constants.mjs";

function toOpaqueColor(value) {
  const trimmed = String(value).trim();
  const themeColor = trimmed.toUpperCase();
  if (THEME_COLORS.includes(themeColor)) {
    return {
      themeColor,
    };
  }

  const hex = trimmed.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }
  const channel = (start) => parseInt(hex.slice(start, start + 2), 16) / 255;
  return {
    rgbColor: {
      red: channel(0),
      green: channel(2),
      blue: channel(4),
    },
  };
}

function toSolidFill(value, opacityPercent) {
  const color = value == null || value === ""
    ? null
    : toOpaqueColor(value);
  if (value && !color) {
    return null;
  }
  const fill = {};
  if (color) {
    fill.color = color;
  }
  if (opacityPercent != null) {
    fill.alpha = opacityPercent / OPACITY_SCALE;
  }
  return Object.keys(fill).length
    ? fill
    : null;
}

function buildTextRange(startIndex, endIndex) {
  if (startIndex == null && endIndex == null) {
    return {
      type: TEXT_RANGE_ALL,
    };
  }
  if (startIndex == null) {
    throw new ConfigurationError("End Index needs a Start Index. Provide both to style a fixed span, Start Index on its own to style from there to the end, or neither to style all of the text.");
  }
  if (endIndex == null) {
    return {
      type: TEXT_RANGE_FROM_START_INDEX,
      startIndex,
    };
  }
  if (endIndex <= startIndex) {
    throw new ConfigurationError(`End Index (${endIndex}) must be greater than Start Index (${startIndex}).`);
  }
  return {
    type: TEXT_RANGE_FIXED_RANGE,
    startIndex,
    endIndex,
  };
}

export default {
  toOpaqueColor,
  toSolidFill,
  buildTextRange,
};
