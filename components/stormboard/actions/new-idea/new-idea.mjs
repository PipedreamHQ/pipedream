import app from "../../stormboard.app.mjs";
import options from "../common/options.mjs";

export default {
  type: "action",
  key: "stormboard-new-idea",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "New Idea",
  description: "Creates a new idea. [See the docs here](https://api.stormboard.com/docs)",
  props: {
    app,
    stormId: {
      propDefinition: [
        app,
        "stormId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of your idea. Defaults to `text`",
      optional: true,
      options: options.IDEA_TYPE_OPTIONS,
    },
    data: {
      type: "string",
      label: "Data",
      description: "Text, video URL, image data, document data. Image and document data must be base64 format.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of video, whiteboard, image, or document. Images and documents should include file extension.",
    },
    color: {
      type: "string",
      label: "Color",
      description: "Color of the idea. Defaults to `yellow`",
      optional: true,
      options: options.IDEA_COLOR_OPTIONS,
    },
    shape: {
      type: "string",
      label: "Shape",
      description: "Shape of the idea. Defaults to `standard`",
      optional: true,
      options: options.IDEA_SHAPE_OPTIONS,
    },
    x: {
      type: "integer",
      label: "X",
      description: "X coordinate of the idea.",
    },
    y: {
      type: "integer",
      label: "Y",
      description: "Y coordinate of the idea.",
    },
    lock: {
      type: "boolean",
      label: "Lock",
      description: "Lock the idea. Defaults to `false`",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      stormid: this.stormId,
      type: this.type,
      data: this.data,
      name: this.name,
      color: this.color,
      shape: this.shape,
      x: this.x,
      y: this.y,
      lock: this.lock
        ? 1
        : 0,
    };
    const res = await this.app.createIdea(data);
    $.export("$summary", "Idea successfully created");
    return res;
  },
};
