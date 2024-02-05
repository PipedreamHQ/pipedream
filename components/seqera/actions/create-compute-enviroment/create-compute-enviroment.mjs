import seqera from "../../seqera.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "seqera-create-compute-environment",
  name: "Create Compute Environment",
  description: "Creates a new compute environment in Seqera Tower. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    seqera,
    computeEnvName: {
      propDefinition: [
        seqera,
        "computeEnvName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.seqera.createComputeEnv({
      computeEnvName: this.computeEnvName,
    });

    $.export("$summary", `Successfully created compute environment '${this.computeEnvName}'`);
    return response;
  },
};
