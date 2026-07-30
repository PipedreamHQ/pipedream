import mural from "../../mural.app.mjs";
import {
  height,
  hidden,
  text,
  title,
  width,
  xPosition,
  yPosition,
} from "../../common/props.mjs";

export default {
  key: "mural-create-textbox",
  name: "Create Textbox",
  description: "Create a new textbox widget within a given mural. Use a textbox for section headings, instructions, or longer prose that should read as plain text on the canvas rather than as a sticky note. Position is set in pixels and, unless **Parent ID** is given, is measured from the top-left corner of the mural. [See the documentation](https://developers.mural.co/public/reference/createtextbox)",
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
    xPosition,
    yPosition,
    text: {
      ...text,
      optional: false,
    },
    title,
    height,
    width,
    hidden,
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
      description: "The ID of the area widget that should contain this textbox, for example `0-1619509853818`. When set, **X Position** and **Y Position** are measured from the area's top-left corner instead of the mural's.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mural.createTextbox({
      $,
      muralId: this.muralId,
      data: [
        {
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
    $.export("$summary", `Successfully created textbox with ID: ${response.value[0].id}`);
    return response;
  },
};
