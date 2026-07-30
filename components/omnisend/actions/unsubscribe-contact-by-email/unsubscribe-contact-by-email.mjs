import { ConfigurationError } from "@pipedream/platform";
import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-unsubscribe-contact-by-email",
  name: "Unsubscribe Contact by Email",
  description: "Unsubscribe an existing Omnisend contact from the email channel by their full email address. This action does not create new contacts. [See the documentation](https://api-docs.omnisend.com/v3/docs/how-to-sync-contacts)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    omnisend,
    email: {
      type: "string",
      label: "Email",
      description: "The full email address of the existing contact to unsubscribe.",
    },
  },
  async run({ $ }) {
    const email = this.email.trim();

    if (!email) {
      throw new ConfigurationError("Enter the email address of the contact to unsubscribe.");
    }

    const { contacts = [] } = await this.omnisend.listContacts({
      $,
      params: {
        email,
        limit: 1,
      },
    });
    const normalizedEmail = email.toLowerCase();
    const contact = contacts.find(({ identifiers = [] }) => {
      const emailIdentifier = identifiers.find(({ type }) => type === "email");
      return emailIdentifier?.id?.toLowerCase() === normalizedEmail;
    });
    const matchedEmailId = contact?.identifiers?.find(({ type }) => type === "email")?.id;

    if (!contact || !matchedEmailId) {
      throw new ConfigurationError(`No Omnisend contact was found for ${email}.`);
    }

    const response = await this.omnisend.updateContact({
      $,
      contactId: contact.contactID,
      data: {
        identifiers: [
          {
            type: "email",
            id: matchedEmailId,
            channels: {
              email: {
                status: "unsubscribed",
              },
            },
          },
        ],
      },
    });

    $.export("$summary", `Unsubscribed ${email} from the email channel`);
    return response;
  },
};
