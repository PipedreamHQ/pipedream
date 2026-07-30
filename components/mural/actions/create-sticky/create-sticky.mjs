import mural from "../../mural.app.mjs";
import { STICKY_SHAPE_OPTIONS } from "../../common/constants.mjs";
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
  key: "mural-create-sticky",
  name: "Create Sticky",
  description: "Create a new sticky note within a given mural. [See the documentation](https://developers.mural.co/public/reference/createstickynote)",
  version: "0.0.3",
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
      options: STICKY_SHAPE_OPTIONS,
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
