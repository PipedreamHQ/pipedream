import mural from "../../mural.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "mural-update-sticky",
  name: "Update Sticky",
  description: "Update or move an existing sticky note on a mural. Every field except the mural and widget is optional, and only the fields you set are sent, so you can reposition a note by supplying just **X Position** and **Y Position** or reword it by supplying just **Text**. At least one updatable field must be set. [See the documentation](https://developers.mural.co/public/reference/updatestickynote)",
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
      description: "The text in the widget with inline HTML formatting, for example `<p><strong>Blocked</strong> on <em>vendor review</em></p>`. Supports `<strong>`, `<em>`, `<u>`, `<s>`, `<ul>`, `<ol>`, and `<li>`. When set, this takes priority over **Text**, and these tags override the widget's bold, italic, underline, and strike style properties.",
      optional: true,
    },
    xPosition: {
      propDefinition: [
        mural,
        "xPosition",
      ],
      description: "The horizontal position of the widget in px (e.g. `100`)",
      optional: true,
    },
    yPosition: {
      propDefinition: [
        mural,
        "yPosition",
      ],
      description: "The vertical position of the widget in px (e.g. `100`)",
      optional: true,
    },
    title: {
      propDefinition: [
        mural,
        "title",
      ],
    },
    height: {
      propDefinition: [
        mural,
        "height",
      ],
    },
    width: {
      propDefinition: [
        mural,
        "width",
      ],
    },
    hidden: {
      propDefinition: [
        mural,
        "hidden",
      ],
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
      description: "The ID of the area widget that should contain this sticky note, for example `0-12345`. When set, **X Position** and **Y Position** are measured from the area's top-left corner instead of the mural's.",
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

    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("Set at least one field to update.");
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
