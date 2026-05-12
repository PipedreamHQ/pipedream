import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-enroll-contact-in-sequence",
  name: "Enroll Contact in Sequence",
  description: "Enroll a contact into a HubSpot sequence. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-sequences-v4/public-enrollments/post-automation-v4-sequences-enrollments)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the HubSpot user enrolling the contact in the sequence. Example: `12345678`.",
    },
    sequenceId: {
      type: "string",
      label: "Sequence ID",
      description: "The ID of the sequence to enroll the contact into. Example: `987654`.",
    },
    contactId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
      label: "Contact ID",
      description: "The ID of the contact to enroll in the sequence.",
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "The connected HubSpot email address used as the sequence sender. Example: `sales@example.com`.",
    },
    senderAliasAddress: {
      type: "string",
      label: "Sender Alias Address",
      description: "The alias email address used by the sender for this enrollment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.enrollContactInSequence({
      $,
      userId: this.userId,
      data: {
        sequenceId: this.sequenceId,
        contactId: this.contactId,
        senderEmail: this.senderEmail,
        senderAliasAddress: this.senderAliasAddress,
      },
    });

    $.export("$summary", `Successfully enrolled contact ${this.contactId} in sequence ${this.sequenceId}`);
    return response;
  },
};
