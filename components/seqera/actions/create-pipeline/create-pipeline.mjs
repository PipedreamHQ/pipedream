import seqera from "../../seqera.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "seqera-create-pipeline",
  name: "Create Pipeline",
  description: "Creates a new pipeline in a user context. [See the documentation](https://docs.seqera.io/platform/23.3.0/api/overview)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    seqera,
    pipelineName: {
      propDefinition: [
        seqera,
        "pipelineName",
      ],
    },
    computeEnvName: {
      propDefinition: [
        seqera,
        "computeEnvName",
      ],
    },
    actionName: {
      propDefinition: [
        seqera,
        "actionName",
      ],
    },
    computeEnvId: {
      propDefinition: [
        seqera,
        "computeEnvId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    eventId: {
      propDefinition: [
        seqera,
        "eventId",
      ],
    },
  },
  async run({ $ }) {
    const pipelineResponse = await this.seqera.createPipeline({
      pipelineName: this.pipelineName,
    });
    const computeEnvResponse = await this.seqera.createComputeEnv({
      computeEnvName: this.computeEnvName,
    });
    const pipelineActionResponse = await this.seqera.createPipelineAction({
      pipelineId: pipelineResponse.id,
      computeEnvId: computeEnvResponse.id,
      actionName: this.actionName,
    });
    const emitEventResponse = await this.seqera.emitEvent({
      eventId: this.eventId,
    });

    $.export("$summary", `Created pipeline '${this.pipelineName}' with action '${this.actionName}'`);

    return {
      pipeline: pipelineResponse,
      computeEnv: computeEnvResponse,
      pipelineAction: pipelineActionResponse,
      eventEmit: emitEventResponse,
    };
  },
};
