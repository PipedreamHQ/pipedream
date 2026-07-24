import superdocu from "../../superdocu.app.mjs";

export default {
  key: "superdocu-get-dossier",
  name: "Get Dossier",
  description: "Retrieve the full detail of a single dossier (the API calls this a `contact workflow`), including its states. Run **List Contacts** first to obtain a contactId, then **List Dossiers** for that contact to obtain a contactWorkflowId. [See the documentation](https://developers.superdocu.com/api/index.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
    contactWorkflowId: {
      propDefinition: [
        superdocu,
        "contactWorkflowId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.superdocu.getContactWorkflow({
      $,
      contactId: this.contactId,
      wid: this.contactWorkflowId,
    });
    $.export("$summary", `Successfully retrieved dossier ${this.contactWorkflowId} for contact ${this.contactId}`);
    return response;
  },
};
