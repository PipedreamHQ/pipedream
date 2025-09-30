import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-create-deal",
  name: "Create Deal",
  description: "Creates a new deal. [See the docs](https://apidoc.overloop.com/#create-a-deal)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    stageId: {
      propDefinition: [
        overloop,
        "stageId",
      ],
      optional: false,
    },
    title: {
      propDefinition: [
        overloop,
        "title",
      ],
      optional: false,
    },
    value: {
      propDefinition: [
        overloop,
        "value",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "deals",
        attributes: {
          stage_id: this.stageId,
          title: this.title,
          value: this.value,
        },
      },
    };

    const { data: response } = await this.overloop.createDeal({
      data,
      $,
    });

    $.export("$summary", `Successfully created deal with ID ${response.id}.`);

    return response;
  },
};
