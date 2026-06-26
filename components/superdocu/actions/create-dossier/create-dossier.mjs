import superdocu from "../../superdocu.app.mjs";

export default {
  key: "superdocu-create-dossier",
  name: "Create Dossier",
  description: "Create a dossier by assigning a workflow to an existing Superdocu contact (the API calls this a `contact workflow`). Run **List Contacts** (or **Create Contact**) first to obtain a contactId, and **List Templates** to obtain a workflowId. Returns the created dossier with its `id` and initial `status`. The API returns 422 if the workflow is disabled, or 409 if a non-repeatable workflow is already assigned. [See the documentation](https://developers.superdocu.com/api/index.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    superdocu,
    contactId: {
      propDefinition: [
        superdocu,
        "contactId",
      ],
    },
    workflowId: {
      propDefinition: [
        superdocu,
        "workflowId",
      ],
    },
    notify: {
      type: "boolean",
      label: "Notify",
      description: "When `true`, sends an invitation email to the contact upon assignment. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.superdocu.createContactWorkflow({
      $,
      contactId: this.contactId,
      data: {
        workflow_id: this.workflowId,
        notify: this.notify,
      },
    });
    $.export("$summary", `Successfully created dossier ${response.data?.id} for contact ${this.contactId}`);
    return response;
  },
};
