import gist from "../../gist.app.mjs";

export default {
  ...gist,
  key: "gist-create-or-update-contact",
  name: "Create Or Update Contact",
  description: "Create or update a contact in Gist [See docs](https://developers.getgist.com/api/#create-or-update-a-contact)",
  type: "action",
  version: "0.0.1",
  props: {
    gist,
    email: {
      propDefinition: [
        gist,
        "email",
      ],
    },
    userId: {
      propDefinition: [
        gist,
        "userId",
      ],
    },
    name: {
      propDefinition: [
        gist,
        "name",
      ],
    },
    phone: {
      propDefinition: [
        gist,
        "phone",
      ],
    },
    signedUpAt: {
      propDefinition: [
        gist,
        "signedUpAt",
      ],
    },
    lastSeenIp: {
      propDefinition: [
        gist,
        "lastSeenIp",
      ],
    },
    lastSeenUserAgent: {
      propDefinition: [
        gist,
        "lastSeenUserAgent",
      ],
    },
    customProperties: {
      propDefinition: [
        gist,
        "customProperties",
      ],
    },
    unsubscribedFromEmails: {
      propDefinition: [
        gist,
        "unsubscribedFromEmails",
      ],
    },
    tagId: {
      propDefinition: [
        gist,
        "tagId",
      ],
      type: "string[]",
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
      user_id: this.userId,
      name: this.name,
      phone: this.phone,
      signed_up_at: this.signedUpAt,
      last_seen_ip: this.lastSeenIp,
      last_seen_user_agent: this.lastSeenUserAgent,
      custom_properties: this.customProperties,
      unsubscribed_from_emails: this.unsubscribedFromEmails,
      tags: this.tagId.map((tag) => tag.label),
    };

    const response = await this.gist.createOrUpdateContact({
      $,
      data,
    });

    const action = (response.contact?.created_at != response.contact?.updated_at)
      ? "updated"
      : "created";

    $.export("$summary", `Successfully ${action} ${this.name || this.email} contact`);

    return response;
  },
};
