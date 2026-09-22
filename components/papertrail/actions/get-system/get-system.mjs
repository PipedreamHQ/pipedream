import papertrail from "../../papertrail.app.mjs";

export default {
  key: "papertrail-get-system",
  name: "Get System",
  description:
    "Retrieve details for a single system by ID or name. [See the documentation](https://www.papertrail.com/help/settings-api/#show-system)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    papertrail,
    systemId: {
      propDefinition: [
        papertrail,
        "systemId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.papertrail.getSystem({
      systemId: this.systemId,
      $,
    });

    $.export("$summary", `Retrieved system **${response.name}** (id ${response.id})`);
    return response;
  },
};
