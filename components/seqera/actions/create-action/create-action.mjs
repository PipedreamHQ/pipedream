import seqera from "../../seqera.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "seqera-create-action",
  name: "Create Seqera Pipeline Action",
  description: "Creates a new pipeline action in Seqera. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    seqera,
    pipelineId: {
      propDefinition: [
        seqera,
        "pipelineId",
      ],
    },
    computeEnvId: {
      propDefinition: [
        seqera,
        "computeEnvId",
      ],
    },
    actionName: {
      propDefinition: [
        seqera,
        "actionName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.seqera.createPipelineAction({
      pipelineId: this.pipelineId,
      computeEnvId: this.computeEnvId,
      actionName: this.actionName,
    });

    $.export("$summary", `Successfully created pipeline action '${this.actionName}'`);
    return response;
  },
};
