import { parseObject } from "../../common/utils.mjs";
import app from "../../simplero.app.mjs";

export default {
  type: "action",
  key: "simplero-subscribe-to-list",
  name: "Subscribe To List",
  description: "Subscribe a contact to a list. [See the documentation](https://github.com/Simplero/Simplero-API?tab=readme-ov-file#subscribe-to-list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The email address of the contact to subscribe",
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      optional: true,
    },
    ipAddress: {
      propDefinition: [
        app,
        "ipAddress",
      ],
      optional: true,
    },
    referrer: {
      propDefinition: [
        app,
        "referrer",
      ],
      optional: true,
    },
    ref: {
      propDefinition: [
        app,
        "ref",
      ],
      optional: true,
    },
    landingPageId: {
      propDefinition: [
        app,
        "landingPageId",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
      optional: true,
    },
    gdprConsent: {
      propDefinition: [
        app,
        "gdprConsent",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.subscribeToList({
      $,
      listId: this.listId,
      data: {
        track: "Pipedream",
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        ip_address: this.ipAddress,
        referrer: this.referrer,
        ref: this.ref,
        landing_page_id: this.landingPageId,
        tags: this.tags && parseObject(this.tags) || [],
        phone: this.phone,
        gdpr_consent: +this.gdprConsent,
      },
    });

    $.export("$summary", `Successfully subscribed ${this.email} to list with ID: ${this.listId}`);

    return response;
  },
};

