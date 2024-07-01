import dropboard from "../../dropboard.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dropboard-create-client",
  name: "Create Client",
  description: "Creates a new client within Dropboard. Note this is available only for recruiter plan users and may incur additional charges based on your organization's plan. [See the documentation](https://dropboard.readme.io/reference/clients-post)",
  version: "0.0.{{ts}}",
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
    },
  },
  async run({ $ }) {
    const data = {
      name: this.clientName,
      ...(this.clientPlanId && {
        clientPlanId: this.clientPlanId,
      }),
    };

    const response = await this.dropboard.createClient({
      data,
    });

    $.export("$summary", `Successfully created client with ID ${response.id}`);
    return response;
  },
};
