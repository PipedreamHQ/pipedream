import streak from "../../streak.app.mjs";

const docLink = "https://streak.readme.io/reference/edit-a-box";

export default {
  key: "streak-link-boxes",
  name: "Link Boxes",
  description: `Link boxes to a specific box. [See the docs](${docLink})`,
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streak,
    pipelineId: {
      propDefinition: [
        streak,
        "pipelineId",
      ],
    },
    boxId: {
      propDefinition: [
        streak,
        "boxId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    boxes: {
      propDefinition: [
        streak,
        "boxId",
        (c) => ({
          pipelineId: c.pipelineId,
          previousBoxId: c.boxId,
        }),
      ],
      type: "string[]",
      description: "The list of boxes you would like to link to the selected box",
    },
  },
  async run({ $ }) {
    const response = await this.streak.updateBox({
      $,
      boxId: this.boxId,
      data: {
        linkedBoxKeys: this.boxes,
      },
    });
    $.export("$summary", "Successfully linked boxes");
    return response;
  },
};
