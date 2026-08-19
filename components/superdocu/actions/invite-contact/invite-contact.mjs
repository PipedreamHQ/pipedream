import superdocu from "../../superdocu.app.mjs";

export default {
  key: "superdocu-invite-contact",
  name: "Invite Contact",
  description: "Invite a Superdocu contact: emails them an invitation covering ALL workflows currently assigned to them. The Superdocu API endpoint takes only a `contactId` and dispatches notifications for every assigned workflow — it is not possible to invite to a single dossier in isolation. Run **List Contacts** first to obtain a valid contactId. [See the documentation](https://developers.superdocu.com/api/index.html).",
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
    const response = await this.superdocu.inviteContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully sent invitation to contact ${this.contactId}`);
    return response;
  },
};
