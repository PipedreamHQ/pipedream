export const VISUALIZATION_TYPES = [
  "table",
  "bar",
  "line",
  "area",
  "pie",
  "scalar",
  "smartscalar",
  "gauge",
  "progress",
  "combo",
  "row",
  "waterfall",
  "funnel",
  "scatter",
  "map",
];

export const QUERY_TYPES = {
  NATIVE: "native",
  STRUCTURED: "query",
};

export const parseMetabaseError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).join(", ");
  }
  return error.message || "An error occurred";
};

export const formatCardSummary = (card) => {
  const {
    id, name, display,
  } = card;
  return `Card "${name}" (ID: ${id}, Type: ${display})`;
};

export const formatDashboardSummary = (dashboard) => {
  const {
    id, name, dashcards = [],
  } = dashboard;
  return `Dashboard "${name}" (ID: ${id}, Cards: ${dashcards.length})`;
};
