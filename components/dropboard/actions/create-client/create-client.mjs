import dropboard from "../../dropboard.app.mjs";

export default {
  key: "dropboard-create-client",
  name: "Create Client",
  description: "Creates a new client within Dropboard. Note this is available only for recruiter plan users and may incur additional charges based on your organization's plan. [See the documentation](https://dropboard.readme.io/reference/clients-post)",
  version: "0.0.3",
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
    const response = await this.dropboard.createClient({
      $,
      data: {
        name: this.clientName,
        clientPlanId: this.clientPlanId,
      },
    });

    $.export("$summary", `Successfully created client with ID ${response.id}`);
    return response;
  },
};
