import cradlAi from "../../cradl_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cradl_ai-parse-document-human-in-loop",
  name: "Parse Document with Human in the Loop",
  description: "Sends a document to an existing flow for human-in-the-loop processing. This action requires a human element for reviewing the model's output. [See the documentation](https://docs.cradl.ai/rest-api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cradlAi,
    document: {
      propDefinition: [
        cradlAi,
        "document",
      ],
    },
    workflowId: {
      propDefinition: [
        cradlAi,
        "workflowId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cradlAi.sendDocumentToFlow({
      data: {
        document: this.document,
        workflowId: this.workflowId,
      },
    });

    $.export("$summary", `Sent document to workflow ${this.workflowId} for processing`);
    return response;
  },
};
