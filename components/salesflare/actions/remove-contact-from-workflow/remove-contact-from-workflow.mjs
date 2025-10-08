import app from "../../salesflare.app.mjs";

export default {
  key: "salesflare-remove-contact-from-workflow",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Remove Contact From Workflow",
  description: "Remove a contact from a workflow [See the docs here](https://api.salesflare.com/docs#operation/putWorkflowsIdAudienceRecord_id)",
  props: {
    app,
    workflowId: {
      propDefinition: [
        app,
        "workflowId",
      ],
    },
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
      description: "Contact ID. Even if given contact is not in the workflow, success message will be returned.",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.removeContactFromWorkflow({
      $,
      workflowId: this.workflowId,
      contactId: this.contactId,
    });
    $.export("$summary", "Contact has been removed from the workflow successfully.");
    return resp;
  },
};
