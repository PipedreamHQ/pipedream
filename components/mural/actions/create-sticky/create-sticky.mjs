import mural from "../../mural.app.mjs";

export default {
  key: "mural-create-sticky",
  name: "Create Sticky",
  description: "Create a new sticky note within a given mural. [See the documentation](https://developers.mural.co/public/reference/createstickynote)",
  version: "0.0.2",
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
      description: "The shape of the sticky note widget",
      options: [
        "circle",
        "rectangle",
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
    tagIds: {
      propDefinition: [
        mural,
        "tagIds",
        (c) => ({
          muralId: c.muralId,
        }),
      ],
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
      description: "The ID of the area widget that contains the widget",
    },
  },
  async run({ $ }) {
    const response = await this.mural.createSticky({
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
    $.export("$summary", `Successfully created sticky note with ID: ${response.value[0].id}`);
    return response;
  },
};
