import dropboard from "../../dropboard.app.mjs";

export default {
  key: "dropboard-find-or-create-client",
  name: "Find or Create Client",
  description: "Looks for a client within Dropboard. If not found, it will create a new one. [See the documentation](https://dropboard.readme.io/reference/clients-post)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dropboard,
    clientName: {
      propDefinition: [
        dropboard,
        "clientName",
      ],
    },
    clientPlanId: {
      propDefinition: [
        dropboard,
        "clientPlanId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      clientName, clientPlanId,
    } = this;

    const response = await this.dropboard.findOrCreateClient({
      $,
      clientName,
      clientPlanId,
    });

    $.export("$summary", `Successfully found or created client: ${response.name}`);
    return response;
  },
};
