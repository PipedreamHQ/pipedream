import mural from "../../mural.app.mjs";

export default {
  key: "mural-create-shape",
  name: "Create Shape",
  description: "Create a new shape widget within a given mural, useful for diagram nodes, callouts, and arrows drawn on the canvas. Shape names are the API's own enum values rather than display names, so a triangle is `triangle_smart` and a diamond is `rhombus_smart`. The legacy values `circle`, `diamond`, `hexagon`, `pentagon`, `square`, and `triangle` still work but are deprecated in favor of `ellipse`, `rhombus_smart`, `hexagon_smart`, `pentagon_smart`, `rectangle`, and `triangle_smart`. [See the documentation](https://developers.mural.co/public/reference/createshapewidget)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mural,
    workspaceId: {
      propDefinition: [
        mural,
        "workspaceId",
      ],
    },
    muralId: {
      propDefinition: [
        mural,
        "muralId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    shape: {
      type: "string",
      label: "Shape",
      description: "The shape of the shape widget",
      options: [
        "ellipse",
        "rectangle",
        "triangle_smart",
        "rhombus_smart",
        "hexagon_smart",
        "pentagon_smart",
        "star",
        "cloud",
        "speech_bubble_center",
        "speech_bubble_left",
        "speech_bubble_right",
        "arrow_down",
        "arrow_left",
        "arrow_right",
        "arrow_top",
        "arrow_left_right",
        "circle",
        "diamond",
        "hexagon",
        "pentagon",
        "square",
        "triangle",
      ],
    },
    xPosition: {
      type: "integer",
      label: "X Position",
      description: "The horizontal position of the widget in px. This is the distance from the left of the parent widget, such as an area. If the widget has no parent widget, this is the distance from the left of the mural.",
    },
    yPosition: {
      type: "integer",
      label: "Y Position",
      description: "The vertical position of the widget in px. This is the distance from the top of the parent widget, such as an area. If the widget has no parent widget, this is the distance from the top of the mural.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text in the widget",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the widget in the outline",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the widget in px",
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the widget in px",
      optional: true,
    },
    hidden: {
      type: "boolean",
      label: "Hidden",
      description: "If `true`, the widget is hidden from non-facilitators. Applies only when the widget is in the outline",
      optional: true,
    },
    parentId: {
      propDefinition: [
        mural,
        "widgetId",
        (c) => ({
          muralId: c.muralId,
          type: "areas",
        }),
      ],
      label: "Parent ID",
      description: "The ID of the area widget that should contain this shape, for example `0-1619509853818`. When set, **X Position** and **Y Position** are measured from the area's top-left corner instead of the mural's.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mural.createShape({
      $,
      muralId: this.muralId,
      data: [
        {
          shape: this.shape,
          x: this.xPosition,
          y: this.yPosition,
          text: this.text,
          title: this.title,
          height: this.height,
          width: this.width,
          hidden: this.hidden,
          parentId: this.parentId,
        },
      ],
    });
    $.export("$summary", `Successfully created shape with ID: ${response.value[0].id}`);
    return response;
  },
};
