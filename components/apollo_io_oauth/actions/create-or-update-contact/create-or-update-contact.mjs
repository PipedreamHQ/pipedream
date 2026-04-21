import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-create-or-update-contact",
  name: "Create or Update Contact",
  description:
    "Creates a new contact or updates an existing one in your"
    + " Apollo CRM. To create, omit `contactId` and provide at"
    + " least an `email`. To update, provide the `contactId`"
    + " and any fields to change."
    + " Use **Search Contacts** to find existing contacts by"
    + " name or email before updating."
    + " Use **List Metadata** (type `contact_stages`) to"
    + " discover valid stage IDs."
    + " The `accountId` links this contact to a company — use"
    + " **Search Accounts** to find the account ID."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/create-a-contact)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      type: "string",
      label: "Contact ID",
      description:
        "The ID of an existing contact to update. Omit this to"
        + " create a new contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description:
        "Email address of the contact. Required when creating.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description:
        "Job title of the contact. Example: `\"VP of Sales\"`.",
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description:
        "ID of the account (company) to link this contact to."
        + " Use **Search Accounts** to find account IDs.",
      optional: true,
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description:
        "The organization website for Apollo to enrich data."
        + " Do NOT pass personal social media URLs. This is"
        + " ignored if a valid email is provided.",
      optional: true,
    },
    labelNames: {
      type: "string[]",
      label: "Label Names",
      description:
        "Tag names to apply to this contact. Example:"
        + " `[\"VIP\", \"Decision Maker\"]`."
        + " Use **List Metadata** (type `labels`) to see"
        + " existing labels.",
      optional: true,
    },
    contactStageId: {
      type: "string",
      label: "Contact Stage ID",
      description:
        "The pipeline stage for this contact."
        + " Use **List Metadata** (type `contact_stages`) to"
        + " discover valid stage IDs.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description:
        "Full address string. Apollo will infer city, state,"
        + " country, and timezone.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Direct dial phone number for this contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      title: this.title,
      account_id: this.accountId,
      website_url: this.websiteUrl,
      label_names: this.labelNames,
      contact_stage_id: this.contactStageId,
      present_raw_address: this.address,
      direct_phone: this.phone,
    };

    let contact;

    if (this.contactId) {
      ({ contact } = await this.app.updateContact({
        $,
        contactId: this.contactId,
        data,
      }));
      $.export(
        "$summary",
        `Updated contact ${contact.id}: ${contact.name || contact.email}`,
      );
    } else {
      ({ contact } = await this.app.createContact({
        $,
        data,
      }));
      $.export(
        "$summary",
        `Created contact ${contact.id}: ${contact.name || contact.email}`,
      );
    }

    return contact;
  },
};
