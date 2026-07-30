export const xPosition = {
  type: "integer",
  label: "X Position",
  description: "The horizontal position of the widget in px (e.g. `100`). This is the distance from the left of the parent widget, such as an area. If the widget has no parent widget, this is the distance from the left of the mural.",
};

export const yPosition = {
  type: "integer",
  label: "Y Position",
  description: "The vertical position of the widget in px (e.g. `100`). This is the distance from the top of the parent widget, such as an area. If the widget has no parent widget, this is the distance from the top of the mural.",
};

export const height = {
  type: "integer",
  label: "Height",
  description: "The height of the widget in px (e.g. `300`)",
  optional: true,
};

export const width = {
  type: "integer",
  label: "Width",
  description: "The width of the widget in px (e.g. `500`)",
  optional: true,
};

export const text = {
  type: "string",
  label: "Text",
  description: "The text in the widget",
  optional: true,
};

export const title = {
  type: "string",
  label: "Title",
  description: "The title of the widget in the outline",
  optional: true,
};

export const hidden = {
  type: "boolean",
  label: "Hidden",
  description: "If `true`, the widget is hidden from non-facilitators. Applies only when the widget is in the outline",
  optional: true,
};

export const updateXPosition = {
  ...xPosition,
  description: "The horizontal position of the widget in px (e.g. `100`)",
  optional: true,
};

export const updateYPosition = {
  ...yPosition,
  description: "The vertical position of the widget in px (e.g. `100`)",
  optional: true,
};
