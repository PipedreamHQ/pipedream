// x-pd-ai: optimized
import {
  LIMIT_MIN,
  LIMIT_MAX,
} from "./constants.mjs";

export const startDate = {
  type: "string",
  label: "Start Date",
  description: "Start date, inclusive, in `YYYYMMDD` format (the `start` param). Example: `20240706`.",
};

export const endDate = {
  type: "string",
  label: "End Date",
  description: "End date, inclusive, in `YYYYMMDD` format (the `end` param). Example: `20240805`.",
};

export const segmentDefinitions = {
  type: "string",
  label: "Segment Definitions",
  description: "JSON-encoded array of segment definitions (the `s` param). Example: `[{\"prop\":\"country\",\"op\":\"is\",\"values\":[\"US\"]}]`.",
  optional: true,
};

export const limit = {
  type: "integer",
  label: "Limit",
  description: `Maximum number of grouped values to return (the \`limit\` param). Min ${LIMIT_MIN}, max ${LIMIT_MAX}. Defaults to 100. Amplitude has no cursor for this endpoint — values beyond this cap are silently dropped by the API, not just this tool. If more than \`limit\` distinct group-by values may exist, raise this toward ${LIMIT_MAX} or narrow with Segment Definitions/Group By.`,
  min: LIMIT_MIN,
  max: LIMIT_MAX,
  optional: true,
};
