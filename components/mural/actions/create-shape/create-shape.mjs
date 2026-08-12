import mural from "../../mural.app.mjs";
import { SHAPE_OPTIONS } from "../../common/constants.mjs";

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
      options: SHAPE_OPTIONS,
    },
    xPosition: {
      propDefinition: [
        mural,
        "xPosition",
      ],
    },
    yPosition: {
      propDefinition: [
        mural,
        "yPosition",
      ],
    },
    text: {
      propDefinition: [
        mural,
        "text",
      ],
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
      description: "The ID of the area widget that should contain this shape, for example `0-12345`. When set, **X Position** and **Y Position** are measured from the area's top-left corner instead of the mural's.",
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
