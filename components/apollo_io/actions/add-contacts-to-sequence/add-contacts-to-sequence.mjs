import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-add-contacts-to-sequence",
  name: "Add Contacts to Sequence",
  description: "Adds one or more contacts to a sequence in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#add-contacts-to-sequence)",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sequenceId: {
      propDefinition: [
        app,
        "sequenceId",
      ],
    },
    contactIds: {
      propDefinition: [
        app,
        "contactId",
      ],
      type: "string[]",
      label: "Contact IDs",
      description: "Identifiers of the contacts to add to sequence",
    },
    emailAccountId: {
      propDefinition: [
        app,
        "emailAccountId",
      ],
    },
    sequenceNoEmail: {
      type: "boolean",
      label: "Sequence No Email",
      description: "  Whether to still sequence the contact if he/she does not have an email address",
      optional: true,
    },
    sequenceActiveInOtherCampaigns: {
      type: "boolean",
      label: "Sequence Active in Other Campaigns",
      description: "Whether to still sequence the contact if he/she is active or paused in another sequence",
      optional: true,
    },
    sequenceFinishedInOtherCampaigns: {
      type: "boolean",
      label: "Sequence Finished in Other Campaigns",
      description: "Whether to still sequence the contact if he/she already finished another sequence",
      optional: true,
    },
  },
  async run({ $ }) {
    const { contacts } = await this.app.addContactsToSequence({
      $,
      sequenceId: this.sequenceId,
      data: {
        contact_ids: this.contactIds,
        emailer_campaign_id: this.sequenceId,
        send_email_from_email_account_id: this.emailAccountId,
        sequence_no_email: this.sequenceNoEmail,
        sequence_active_in_other_campaigns: this.sequenceActiveInOtherCampaigns,
        sequence_finished_in_other_campaigns: this.sequencFinishedInOtherCampaigns,
      },
    });

    $.export("$summary", `Successfully added ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"} to sequence.`);

    return contacts;
  },
};
