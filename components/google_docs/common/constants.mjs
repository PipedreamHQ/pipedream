// Maximum `pageSize` accepted by the Drive API's `comments.list`; larger values are
// coerced down to this by the API.
// https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/list
const COMMENTS_MAX_PAGE_SIZE = 100;

const DEFAULT_COMMENT_LIMIT = 100;
const MAX_COMMENT_LIMIT = 500;

export {
  COMMENTS_MAX_PAGE_SIZE,
  DEFAULT_COMMENT_LIMIT,
  MAX_COMMENT_LIMIT,
};

// Google Docs API enum values. Kept here rather than inline so the styling
// actions and the app file agree on one spelling of each.
// https://developers.google.com/workspace/docs/api/reference/rest/v1/documents

export const NAMED_STYLE_TYPES = [
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

export const ALIGNMENTS = [
  "START",
  "CENTER",
  "END",
  "JUSTIFIED",
];

export const BULLET_PRESETS = [
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

export const BASELINE_OFFSETS = [
  "NONE",
  "SUPERSCRIPT",
  "SUBSCRIPT",
];

export const DASH_STYLES = [
  "SOLID",
  "DOT",
  "DASH",
];

export const BORDER_SIDES = [
  "borderTop",
  "borderBottom",
  "borderLeft",
  "borderRight",
];

// Documented default dash style for a new border. An omitted dashStyle arrives
// as DASH_STYLE_UNSPECIFIED, which the API rejects for a border.
export const DEFAULT_DASH_STYLE = "SOLID";

export const CONTENT_ALIGNMENTS = [
  "TOP",
  "MIDDLE",
  "BOTTOM",
];

export const OCCURRENCES = [
  "first",
  "all",
];

// Dimension.unit — the only unit the Docs API accepts.
export const POINTS = "PT";

// WeightedFontFamily.weight bounds. The API takes a multiple of 100 in this
// range, and silently substitutes 400 when the field is omitted.
export const FONT_WEIGHT_MIN = 100;
export const FONT_WEIGHT_MAX = 900;
export const FONT_WEIGHT_STEP = 100;

// How deep `listTabs`' metadata field mask spells out nested `childTabs`.
// Google's field masks have no recursive wildcard, so the nesting has to be
// written out to a fixed depth, and a depth that is too shallow would silently
// omit tabs rather than error.
//
// 4 is provably enough: `addDocumentTab` refuses a fourth level outright
// ("Tab nesting level cannot exceed 3." — measured), so `nestingLevel` tops out
// at 2. The extra level is margin in case that cap is ever raised, and
// `listTabs` still checks for a tab sitting at the mask's floor so a raised cap
// would cost one more request instead of losing tabs.
// https://developers.google.com/workspace/docs/api/how-tos/field-masks
export const TAB_METADATA_MASK_DEPTH = 4;
