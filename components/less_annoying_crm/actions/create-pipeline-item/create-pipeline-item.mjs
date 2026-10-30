import app from "../../less_annoying_crm.app.mjs";

export default {
  key: "less_annoying_crm-create-pipeline-item",
  name: "Create Pipeline Item",
  description: "Adds a contact or company to a pipeline at a given status in Less Annoying CRM. Use this to create a lead (pipeline item in the \"Leads\" pipeline) or any other pipeline item."
    + " Use **List Pipelines** first to get `pipelineId` and `statusId`, and **Search Contacts** to get `contactId` (create the contact with **Create Contact** if it does not exist)."
    + " The optional `note` appears in the item's history. Set `runStatusAutomation` only if the user wants the status's configured automation to fire (e.g. send an email or create tasks)."
    + " Returns the new `PipelineItemId`."
    + " Example: `contactId: \"1234567890123456789012345678901\", pipelineId: \"1234567890123456789012345678904\", statusId: \"1234567890123456789012345678905\", note: \"Inbound website inquiry\"` returns `{\"PipelineItemId\": \"1234567890123456789012345678903\"}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Pipeline_Items#Goto-CreatePipelineItem)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    pipelineId: {
      propDefinition: [
        app,
        "pipelineId",
      ],
    },
    statusId: {
      propDefinition: [
        app,
        "statusId",
      ],
    },
    note: {
      propDefinition: [
        app,
        "pipelineItemNote",
      ],
    },
    runStatusAutomation: {
      propDefinition: [
        app,
        "runStatusAutomation",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createPipelineItem({
      $,
      parameters: {
        ContactId: this.contactId,
        PipelineId: this.pipelineId,
        StatusId: this.statusId,
        Note: this.note,
        RunStatusAutomation: this.runStatusAutomation ?? false,
      },
    });

    $.export("$summary", `Created pipeline item ${response.PipelineItemId} for contact ${this.contactId}`);
    return response;
  },
};
