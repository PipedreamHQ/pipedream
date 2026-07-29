import mural from "../../mural.app.mjs";

export default {
  key: "mural-update-sticky",
  name: "Update Sticky",
  description: "Update or move a sticky note on a mural. [See the documentation](https://developers.mural.co/public/reference/updatestickynote)",
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
    widgetId: {
      propDefinition: [
        mural,
        "widgetId",
        (c) => ({
          muralId: c.muralId,
          type: "sticky notes",
        }),
      ],
      optional: false,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text in the widget",
      optional: true,
    },
    htmlText: {
      type: "string",
      label: "HTML Text",
      description: "The text in the widget with inline HTML formatting. When set, takes priority over the Text property.",
      optional: true,
    },
    xPosition: {
      type: "integer",
      label: "X Position",
      description: "The horizontal position of the widget in px",
      optional: true,
    },
    yPosition: {
      type: "integer",
      label: "Y Position",
      description: "The vertical position of the widget in px",
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
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    const fields = {
      text: this.text,
      htmlText: this.htmlText,
      title: this.title,
      height: this.height,
      width: this.width,
      hidden: this.hidden,
      tags: this.tagIds,
      parentId: this.parentId,
    };

    if (this.xPosition !== undefined) {
      data.x = this.xPosition;
    }
    if (this.yPosition !== undefined) {
      data.y = this.yPosition;
    }

    for (const [
      key,
      value,
    ] of Object.entries(fields)) {
      if (value !== undefined) {
        data[key] = value;
      }
    }

    const response = await this.mural.updateSticky({
      $,
      muralId: this.muralId,
      widgetId: this.widgetId,
      data,
    });
    $.export("$summary", `Successfully updated sticky note with ID: ${this.widgetId}`);
    return response;
  },
};
