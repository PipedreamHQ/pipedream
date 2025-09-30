import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-get-deal",
  name: "Get Deal",
  description: "Retrieves a deal by id. [See the docs](https://apidoc.overloop.com/#retrieve-a-deal)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    overloop,
    dealId: {
      propDefinition: [
        overloop,
        "dealId",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.overloop.getDeal(this.dealId, {
      $,
    });

    $.export("$summary", `Successfully retrieved deal with ID ${response.id}.`);

    return response;
  },
};
