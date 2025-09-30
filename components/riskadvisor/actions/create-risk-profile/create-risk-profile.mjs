import riskadvisor from "../../riskadvisor.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "riskadvisor-create-risk-profile",
  name: "Create Risk Profile",
  description: "Creates a risk profile in RiskAdvisor. [See the documentation](https://api.riskadvisor.insure/risk-profiles#create-a-risk-profile)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    riskadvisor,
    insuranceType: {
      type: "string",
      label: "Insurance Type",
      description: "The type of insurance",
      options: constants.INSURANCE_TYPES,
    },
    clientId: {
      propDefinition: [
        riskadvisor,
        "clientId",
      ],
      description: "Unique identifier for the client in the risk profile.",
    },
    coClientId: {
      propDefinition: [
        riskadvisor,
        "clientId",
      ],
      label: "Co-Client",
      description: "Unique identifier for the other client in the risk profile.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.riskadvisor.createRiskProfile({
      data: {
        insurance_type: this.insuranceType,
        client_id: this.clientId,
        co_client_id: this.coClientId,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created risk profile with ID ${response.id}.`);
    }

    return response;
  },
};
