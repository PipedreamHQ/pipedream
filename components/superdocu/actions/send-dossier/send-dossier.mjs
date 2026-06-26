import superdocu from "../../superdocu.app.mjs";

export default {
  key: "superdocu-send-dossier",
  name: "Send Dossier",
  description: "Send (invite) a Superdocu contact, emailing them an invitation to ALL of their assigned dossiers (workflows). This is a per-contact operation, not per-dossier: the API endpoint takes only a contactId and dispatches to every workflow assigned to that contact. Run **List Contacts** first to obtain a valid contactId. [See the documentation](https://developers.superdocu.com/api/index.html).",
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
      description: "The ID of the contact to invite. The invitation covers all workflows assigned to this contact. Run **List Contacts** first to obtain a valid contact ID.",
    },
  },
  async run({ $ }) {
    await this.superdocu.inviteContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully sent invitation to contact ${this.contactId}`);
  },
};
