import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-list-metadata",
  name: "List Metadata",
  description:
    "Lists metadata such as stages, sequences, labels, email"
    + " accounts, or team users."
    + " Use this tool to discover valid IDs before calling write"
    + " tools — e.g., find a contact stage ID for"
    + " **Create or Update Contact**, a sequence ID for"
    + " **Add Contacts to Sequence**, or an opportunity stage ID"
    + " for **Create or Update Opportunity**."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/get-contact-stages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    metadataType: {
      type: "string",
      label: "Metadata Type",
      description:
        "The type of metadata to list."
        + " `contact_stages` — pipeline stages for contacts."
        + " `account_stages` — pipeline stages for accounts."
        + " `opportunity_stages` — pipeline stages for"
        + " opportunities/deals."
        + " `sequences` — email outreach sequences/campaigns."
        + " `email_accounts` — connected email sending accounts."
        + " `labels` — tags/labels for contacts."
        + " `users` — team members (useful for owner IDs).",
      options: [
        "contact_stages",
        "account_stages",
        "opportunity_stages",
        "sequences",
        "email_accounts",
        "labels",
        "users",
      ],
    },
  },
  async run({ $ }) {
    const fetchMap = {
      contact_stages: {
        fn: () => this.app.listContactStages({
          $,
        }),
        key: "contact_stages",
      },
      account_stages: {
        fn: () => this.app.listAccountStages({
          $,
        }),
        key: "account_stages",
      },
      opportunity_stages: {
        fn: () => this.app.listOpportunityStages({
          $,
        }),
        key: "opportunity_stages",
      },
      sequences: {
        fn: () => this.app.listSequences({
          $,
        }),
        key: "emailer_campaigns",
      },
      email_accounts: {
        fn: () => this.app.listEmailAccounts({
          $,
        }),
        key: "email_accounts",
      },
      labels: {
        fn: () => this.app.listLabels({
          $,
        }),
        key: "labels",
      },
      users: {
        fn: () => this.app.listUsers({
          $,
        }),
        key: "users",
      },
    };

    const {
      fn, key,
    } = fetchMap[this.metadataType];
    const response = await fn();
    const results = key
      ? response[key]
      : response;

    $.export(
      "$summary",
      `Found ${results?.length ?? 0} ${this.metadataType.replace(/_/g, " ")}`,
    );

    return results;
  },
};
