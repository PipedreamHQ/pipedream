import { ConfigurationError } from "@pipedream/platform";
import gist from "../../gist.app.mjs";

export default {
  key: "gist-create-or-update-contact",
  name: "Create Or Update Contact",
  description: "Create or update a contact in Gist [See docs](https://developers.getgist.com/api/#create-or-update-a-contact)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gist,
    email: {
      propDefinition: [
        gist,
        "email",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        gist,
        "userId",
      ],
      optional: true,
    },
    name: {
      label: "Name",
      description: "The full name of the contact",
      type: "string",
      optional: true,
    },
    phone: {
      label: "Phone",
      description: "The contact number of the contact",
      type: "string",
      optional: true,
    },
    signedUpAt: {
      label: "Signed Up At",
      description: "The time the contact signed up",
      type: "string",
      optional: true,
    },
    lastSeenIp: {
      label: "Last Seen Ip",
      description: "The last IP address the contact visited your website from",
      type: "string",
      optional: true,
    },
    lastSeenUserAgent: {
      label: "Last Seen User Agent",
      description: "The last contact agent the contact was seen using",
      type: "string",
      optional: true,
    },
    customProperties: {
      label: "Custom  Properties",
      description: "A JSON object containing the contact's custom properties. E.g. { \"name\": \"John Doe\" }",
      type: "object",
      optional: true,
    },
    unsubscribedFromEmails: {
      label: "Unsubscribed From Emails",
      description: "If the contact has unsubscribed from emails or not",
      type: "boolean",
      optional: true,
    },
    tagId: {
      propDefinition: [
        gist,
        "tagId",
      ],
      type: "string[]",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      userId,
      signedUpAt,
      lastSeenIp,
      lastSeenUserAgent,
      customProperties,
      unsubscribedFromEmails,
      tagId,
      ...data
    } = this;

    if (!userId && !this.email) {
      throw new ConfigurationError("You must fill in at least **User Id** or **Email**");
    }

    const response = await this.gist.createOrUpdateContact({
      $,
      data: {
        id: userId,
        signed_up_at: signedUpAt,
        last_seen_ip: lastSeenIp,
        last_seen_user_agent: lastSeenUserAgent,
        custom_properties: customProperties,
        unsubscribed_from_emails: unsubscribedFromEmails,
        tags: tagId && tagId.map((tag) => tag.label),
        ...data,
      },
    });

    const action = (response.contact?.created_at != response.contact?.updated_at)
      ? "updated"
      : "created";

    $.export("$summary", `Successfully ${action} ${this.name || this.email} contact`);

    return response;
  },
};
