import kustomer from "../../kustomer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kustomer-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/updatecustomer)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kustomer: {
      type: "app",
      app: "kustomer",
    },
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
    signedUpAt: {
      propDefinition: [
        kustomer,
        "signedUpAt",
      ],
      optional: true,
    },
    lastActivityAt: {
      propDefinition: [
        kustomer,
        "lastActivityAt",
      ],
      optional: true,
    },
    lastCustomerActivityAt: {
      propDefinition: [
        kustomer,
        "lastCustomerActivityAt",
      ],
      optional: true,
    },
    lastSeenAt: {
      propDefinition: [
        kustomer,
        "lastSeenAt",
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
    facebookIds: {
      propDefinition: [
        kustomer,
        "facebookIds",
      ],
      optional: true,
    },
    instagramIds: {
      propDefinition: [
        kustomer,
        "instagramIds",
      ],
      optional: true,
    },
    socials: {
      propDefinition: [
        kustomer,
        "socials",
      ],
      optional: true,
    },
    sharedSocials: {
      propDefinition: [
        kustomer,
        "sharedSocials",
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
    locations: {
      propDefinition: [
        kustomer,
        "locations",
      ],
      optional: true,
    },
    locale: {
      propDefinition: [
        kustomer,
        "locale",
      ],
      optional: true,
    },
    timeZone: {
      propDefinition: [
        kustomer,
        "timeZone",
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
    sentiment: {
      propDefinition: [
        kustomer,
        "sentiment",
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
    createdAt: {
      propDefinition: [
        kustomer,
        "createdAt",
      ],
      optional: true,
    },
    importedAt: {
      propDefinition: [
        kustomer,
        "importedAt",
      ],
      optional: true,
    },
    rev: {
      propDefinition: [
        kustomer,
        "rev",
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
    const updateData = {
      name: this.name,
      company: this.company,
      externalId: this.externalId,
      username: this.username,
      signedUpAt: this.signedUpAt,
      lastActivityAt: this.lastActivityAt,
      lastCustomerActivityAt: this.lastCustomerActivityAt,
      lastSeenAt: this.lastSeenAt,
      avatarUrl: this.avatarUrl,
      externalIds: this.externalIds,
      sharedExternalIds: this.sharedExternalIds,
      emails: this.emails,
      sharedEmails: this.sharedEmails,
      phones: this.phones,
      sharedPhones: this.sharedPhones,
      whatsApps: this.whatsApps,
      facebookIds: this.facebookIds,
      instagramIds: this.instagramIds,
      socials: this.socials,
      sharedSocials: this.sharedSocials,
      urls: this.urls,
      locations: this.locations,
      locale: this.locale,
      timeZone: this.timeZone,
      tags: this.tags,
      sentiment: this.sentiment,
      birthdayAt: this.birthdayAt,
      gender: this.gender,
      createdAt: this.createdAt,
      importedAt: this.importedAt,
      rev: this.rev,
      defaultLang: this.defaultLang,
    };

    const response = await this.kustomer.updateCustomer({
      customerId: this.customerId,
      ...updateData,
    });

    $.export("$summary", `Successfully updated customer with ID ${this.customerId}`);
    return response;
  },
};
