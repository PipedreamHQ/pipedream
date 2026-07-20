import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-save-contact",
  name: "Save Contact",
  description:
    "Create or update an Outlook contact (upsert)."
    + " Omit `contactId` to create a new contact; provide `contactId` to update an existing one."
    + " Use **Find Contacts** first to look up a contact's `id` before updating."
    + " Example (create): `save-contact(givenName=\"Cosmo\", surname=\"Kramer\", emailAddresses=[\"kramer@kramerica.com\"])` → creates contact, returns new contact object with `id`."
    + " Example (update): `save-contact(contactId=\"AQMk...\", businessPhones=[\"+1-555-0100\"])` → patches the existing contact."
    + " [See the create documentation](https://docs.microsoft.com/en-us/graph/api/user-post-contacts)"
    + " [See the update documentation](https://docs.microsoft.com/en-us/graph/api/contact-update)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    microsoftOutlook,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The Microsoft Graph contact ID. Provide to update an existing contact; omit to create a new one. Obtain from **Find Contacts** (`id` field).",
      optional: true,
    },
    givenName: {
      propDefinition: [
        microsoftOutlook,
        "givenName",
      ],
    },
    surname: {
      propDefinition: [
        microsoftOutlook,
        "surname",
      ],
    },
    emailAddresses: {
      propDefinition: [
        microsoftOutlook,
        "emailAddresses",
      ],
      description: "Array of email address strings, e.g. `[\"kramer@kramerica.com\"]`.",
    },
    businessPhones: {
      propDefinition: [
        microsoftOutlook,
        "businessPhones",
      ],
      label: "Business Phones",
      description: "Array of phone number strings, e.g. `[\"+1-555-0100\"]`.",
    },
  },
  async run({ $ }) {
    const emailAddresses = this.emailAddresses?.length
      ? this.emailAddresses.map((address, i) => ({
        address,
        name: `Email #${i + 1}`,
      }))
      : undefined;

    const data = {};
    if (this.givenName !== undefined) data.givenName = this.givenName;
    if (this.surname !== undefined) data.surname = this.surname;
    if (emailAddresses) data.emailAddresses = emailAddresses;
    if (this.businessPhones?.length) data.businessPhones = this.businessPhones;

    if (this.contactId) {
      const response = await this.microsoftOutlook.updateContact({
        contactId: this.contactId,
        data,
      });
      $.export("$summary", `Contact updated (id: ${this.contactId})`);
      return response;
    } else {
      const response = await this.microsoftOutlook.createContact({
        data,
      });
      const displayName = response.displayName || `${data.givenName || ""} ${data.surname || ""}`.trim();
      $.export("$summary", `Contact created: ${displayName} (id: ${response.id})`);
      return response;
    }
  },
};
