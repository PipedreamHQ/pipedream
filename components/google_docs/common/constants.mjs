// Google Docs API enum values. Kept here rather than inline so the styling
// actions and the app file agree on one spelling of each.
// https://developers.google.com/workspace/docs/api/reference/rest/v1/documents

const NAMED_STYLE_TYPES = [
  "NORMAL_TEXT",
  "TITLE",
  "SUBTITLE",
  "HEADING_1",
  "HEADING_2",
  "HEADING_3",
  "HEADING_4",
  "HEADING_5",
  "HEADING_6",
];

const ALIGNMENTS = [
  "START",
  "CENTER",
  "END",
  "JUSTIFIED",
];

const BULLET_PRESETS = [
  "BULLET_DISC_CIRCLE_SQUARE",
  "BULLET_DIAMONDX_ARROW3D_SQUARE",
  "BULLET_CHECKBOX",
  "BULLET_ARROW_DIAMOND_DISC",
  "BULLET_STAR_CIRCLE_SQUARE",
  "BULLET_ARROW3D_CIRCLE_SQUARE",
  "BULLET_LEFTTRIANGLE_DIAMOND_DISC",
  "BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE",
  "BULLET_DIAMOND_CIRCLE_SQUARE",
  "NUMBERED_DECIMAL_ALPHA_ROMAN",
  "NUMBERED_DECIMAL_ALPHA_ROMAN_PARENS",
  "NUMBERED_DECIMAL_NESTED",
  "NUMBERED_UPPERALPHA_ALPHA_ROMAN",
  "NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL",
  "NUMBERED_ZERODECIMAL_ALPHA_ROMAN",
];

const BASELINE_OFFSETS = [
  "NONE",
  "SUPERSCRIPT",
  "SUBSCRIPT",
];

const DASH_STYLES = [
  "SOLID",
  "DOT",
  "DASH",
];

const BORDER_SIDES = [
  "borderTop",
  "borderBottom",
  "borderLeft",
  "borderRight",
];

// Documented default dash style for a new border. An omitted dashStyle arrives
// as DASH_STYLE_UNSPECIFIED, which the API rejects for a border.
const DEFAULT_DASH_STYLE = "SOLID";

const CONTENT_ALIGNMENTS = [
  "TOP",
  "MIDDLE",
  "BOTTOM",
];

const OCCURRENCES = [
  "first",
  "all",
];

// Dimension.unit — the only unit the Docs API accepts.
const POINTS = "PT";

// WeightedFontFamily.weight bounds. The API takes a multiple of 100 in this
// range, and silently substitutes 400 when the field is omitted.
const FONT_WEIGHT_MIN = 100;
const FONT_WEIGHT_MAX = 900;
const FONT_WEIGHT_STEP = 100;

export default {
  NAMED_STYLE_TYPES,
  ALIGNMENTS,
  BULLET_PRESETS,
  BASELINE_OFFSETS,
  DASH_STYLES,
  BORDER_SIDES,
  DEFAULT_DASH_STYLE,
  CONTENT_ALIGNMENTS,
  OCCURRENCES,
  POINTS,
  FONT_WEIGHT_MIN,
  FONT_WEIGHT_MAX,
  FONT_WEIGHT_STEP,
};
