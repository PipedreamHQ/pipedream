import {
  parseObject, throwError,
} from "../../common/utils.mjs";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/updatecustomer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kustomer,
    customerId: {
      propDefinition: [
        kustomer,
        "customerId",
      ],
    },
    name: {
      propDefinition: [
        kustomer,
        "name",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        kustomer,
        "company",
      ],
      optional: true,
    },
    externalId: {
      propDefinition: [
        kustomer,
        "externalId",
      ],
      optional: true,
    },
    username: {
      propDefinition: [
        kustomer,
        "username",
      ],
      optional: true,
    },
    avatarUrl: {
      propDefinition: [
        kustomer,
        "avatarUrl",
      ],
      optional: true,
    },
    externalIds: {
      propDefinition: [
        kustomer,
        "externalIds",
      ],
      optional: true,
    },
    sharedExternalIds: {
      propDefinition: [
        kustomer,
        "sharedExternalIds",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        kustomer,
        "emails",
      ],
      optional: true,
    },
    sharedEmails: {
      propDefinition: [
        kustomer,
        "sharedEmails",
      ],
      optional: true,
    },
    phones: {
      propDefinition: [
        kustomer,
        "phones",
      ],
      optional: true,
    },
    sharedPhones: {
      propDefinition: [
        kustomer,
        "sharedPhones",
      ],
      optional: true,
    },
    whatsApps: {
      propDefinition: [
        kustomer,
        "whatsApps",
      ],
      optional: true,
    },
    urls: {
      propDefinition: [
        kustomer,
        "urls",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        kustomer,
        "tags",
      ],
      optional: true,
    },
    sentimentPolarity: {
      propDefinition: [
        kustomer,
        "sentimentPolarity",
      ],
      optional: true,
    },
    sentimentConfidence: {
      propDefinition: [
        kustomer,
        "sentimentConfidence",
      ],
      optional: true,
    },
    birthdayAt: {
      propDefinition: [
        kustomer,
        "birthdayAt",
      ],
      optional: true,
    },
    gender: {
      propDefinition: [
        kustomer,
        "gender",
      ],
      optional: true,
    },
    defaultLang: {
      propDefinition: [
        kustomer,
        "defaultLang",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const sentiment = {};
      if (this.sentimentConfidence) sentiment.confidence = parseInt(this.sentimentConfidence);
      if (this.sentimentPolarity) sentiment.polarity = parseInt(this.sentimentPolarity);

      const response = await this.kustomer.updateCustomer({
        $,
        customerId: this.customerId,
        data: {
          name: this.name,
          company: this.company,
          externalId: this.externalId,
          username: this.username,
          avatarUrl: this.avatarUrl,
          externalIds: parseObject(this.externalIds)?.map((id) => ({
            externalId: id,
          })),
          sharedExternalIds: parseObject(this.sharedExternalIds)?.map((id) => ({
            externalId: id,
          })),
          emails: parseObject(this.emails)?.map((email) => ({
            email,
          })),
          sharedEmails: parseObject(this.sharedEmails)?.map((email) => ({
            email,
          })),
          phones: parseObject(this.phones)?.map((phone) => ({
            phone: `${phone}`,
          })),
          sharedPhones: parseObject(this.sharedPhones)?.map((phone) => ({
            phone: `${phone}`,
          })),
          whatsapps: parseObject(this.whatsApps)?.map((phone) => ({
            phone: `${phone}`,
          })),
          urls: parseObject(this.urls)?.map((url) => ({
            url,
          })),
          tags: parseObject(this.tags),
          sentiment: Object.entries(sentiment).length
            ? sentiment
            : undefined,
          birthdayAt: this.birthdayAt,
          gender: this.gender,
          createdAt: this.createdAt,
          importedAt: this.importedAt,
          defaultLang: this.defaultLang,
        },
      });
      $.export("$summary", `Successfully updated customer with ID ${this.customerId}`);
      return response;
    } catch ({ message }) {
      throwError(message);
    }
  },
};
