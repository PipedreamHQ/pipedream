import agentset from "../../agentset.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agentset-create-ingest-job",
  name: "Create Ingest Job",
  description: "Create an ingest job for the authenticated organization. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/ingest-jobs/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agentset,
    namespaceId: {
      propDefinition: [
        agentset,
        "namespaceId",
      ],
    },
    payloadType: {
      propDefinition: [
        agentset,
        "payloadType",
      ],
    },
    payload: {
      propDefinition: [
        agentset,
        "payload",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.agentset.createIngestJob(this.namespaceId, this.payloadType, this.payload);
    $.export("$summary", `Ingest job created successfully: ID ${response.id}`);
    return response;
  },
};
