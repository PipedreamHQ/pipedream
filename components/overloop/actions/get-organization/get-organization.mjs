import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-get-organization",
  name: "Get Organization",
  description: "Retrieves an organization by id. [See the docs](https://apidoc.overloop.com/#retrieve-an-organization)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    overloop,
    organizationId: {
      propDefinition: [
        overloop,
        "organizationId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const { data: response } = await this.overloop.getOrganization(this.organizationId, {
      $,
    });

    $.export("$summary", `Successfully retrieved organization with ID ${response.id}.`);

    return response;
  },
};
