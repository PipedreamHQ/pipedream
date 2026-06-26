import superdocu from "../../superdocu.app.mjs";

export default {
  key: "superdocu-delete-dossier",
  name: "Delete Dossier",
  description: "Permanently delete a dossier (the API calls this a `contact workflow`) from a contact. This is irreversible. Run **List Contacts** first to obtain a contactId, then **List Dossiers** for that contact to obtain a contactWorkflowId. [See the documentation](https://developers.superdocu.com/api/index.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    await this.superdocu.deleteContactWorkflow({
      $,
      contactId: this.contactId,
      wid: this.contactWorkflowId,
    });
    $.export("$summary", `Successfully deleted dossier ${this.contactWorkflowId} from contact ${this.contactId}`);
  },
};
