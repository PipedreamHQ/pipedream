import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-add-contacts-to-sequence",
  name: "Add Contacts to Sequence",
  description:
    "Adds one or more contacts to an email outreach sequence in"
    + " Apollo. Requires a sequence ID, contact IDs, and a"
    + " sending email account ID."
    + " Use **List Metadata** (type `sequences`) to find"
    + " sequence IDs, (type `email_accounts`) to find email"
    + " account IDs."
    + " Use **Search Contacts** to find contact IDs to enroll."
    + " Set `sequenceActiveInOtherCampaigns` to `true` to"
    + " enroll contacts already active in other sequences."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/add-contacts-to-sequence)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sequenceId: {
      type: "string",
      label: "Sequence ID",
      description:
        "The ID of the sequence to add contacts to."
        + " Use **List Metadata** (type `sequences`) to find"
        + " available sequences.",
    },
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description:
        "One or more contact IDs to enroll in the sequence."
        + " Use **Search Contacts** to find contact IDs.",
    },
    emailAccountId: {
      type: "string",
      label: "Email Account ID",
      description:
        "The ID of the email account to send from."
        + " Use **List Metadata** (type `email_accounts`) to"
        + " find available sending accounts.",
    },
    sequenceNoEmail: {
      type: "boolean",
      label: "Sequence Without Email",
      description:
        "Set to `true` to sequence contacts even if they don't"
        + " have an email address.",
      optional: true,
    },
    sequenceActiveInOtherCampaigns: {
      type: "boolean",
      label: "Sequence Active in Other Campaigns",
      description:
        "Set to `true` to enroll contacts who are already"
        + " active or paused in another sequence.",
      optional: true,
    },
    sequenceFinishedInOtherCampaigns: {
      type: "boolean",
      label: "Sequence Finished in Other Campaigns",
      description:
        "Set to `true` to enroll contacts who have already"
        + " finished another sequence.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addContactsToSequence({
      $,
      sequenceId: this.sequenceId,
      data: {
        contact_ids: this.contactIds,
        emailer_campaign_id: this.sequenceId,
        send_email_from_email_account_id: this.emailAccountId,
        sequence_no_email: this.sequenceNoEmail,
        sequence_active_in_other_campaigns:
          this.sequenceActiveInOtherCampaigns,
        sequence_finished_in_other_campaigns:
          this.sequenceFinishedInOtherCampaigns,
      },
    });
    const contacts = response?.contacts ?? [];

    $.export(
      "$summary",
      `Added ${contacts?.length} contact${contacts?.length === 1
        ? ""
        : "s"} to sequence`,
    );

    return contacts;
  },
};
