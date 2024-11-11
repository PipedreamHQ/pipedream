import mural from "../../mural.app.mjs";

export default {
  key: "mural-create-sticky",
  name: "Create Sticky",
  description: "Create a new sticky note within a given mural. [See the documentation](https://developers.mural.co/public/docs/mural-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mural,
    muralId: {
      propDefinition: [
        mural,
        "muralId",
      ],
    },
    content: {
      propDefinition: [
        mural,
        "stickyContent",
      ],
    },
    color: {
      propDefinition: [
        mural,
        "color",
      ],
      optional: true,
    },
    position: {
      propDefinition: [
        mural,
        "position",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mural.createSticky({
      data: {
        muralId: this.muralId,
        content: this.content,
        color: this.color,
        position: this.position,
      },
    });
    $.export("$summary", `Successfully created sticky note with ID: ${response.id}`);
    return response;
  },
};
