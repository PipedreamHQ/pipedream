const BASE_URL = "https://api.miro.com";
const VERSION_PATH = "/v2";
const DEFAULT_LIMIT = 50;

const SHAPE = {
  SQUARE: "square",
  RECTANGLE: "rectangle",
  ROUND_RECTANGLE: "round_rectangle",
  CIRCLE: "circle",
  TRIANGLE: "triangle",
  RHOMBUS: "rhombus",
  PARALLELOGRAM: "parallelogram",
  TRAPEZOID: "trapezoid",
  PENTAGON: "pentagon",
  HEXAGON: "hexagon",
  OCTAGON: "octagon",
  WEDGE_ROUND_RECTANGLE_CALLOUT: "wedge_round_rectangle_callout",
  STAR: "star",
  FLOW_CHART_PREDEFINED_PROCESS: "flow_chart_predefined_process",
  CLOUD: "cloud",
  CROSS: "cross",
  CAN: "can",
  RIGHT_ARROW: "right_arrow",
  LEFT_ARROW: "left_arrow",
  LEFT_RIGHT_ARROW: "left_right_arrow",
  LEFT_BRACE: "left_brace",
  RIGHT_BRACE: "right_brace",
};

const ITEM_SHAPES_OPTIONS =
  Object.values(SHAPE)
    .filter((value) => value !== SHAPE.SQUARE);

const STICKY_NOTE_SHAPES_OPTIONS = [
  SHAPE.SQUARE,
  SHAPE.RECTANGLE,
];

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  ITEM_SHAPES_OPTIONS,
  STICKY_NOTE_SHAPES_OPTIONS,
};
