import { axios } from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Kustomer. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kustomer: {
      type: "app",
      app: "kustomer",
    },
    name: {
      propDefinition: [
        "kustomer",
        "name",
      ],
    },
    company: {
      propDefinition: [
        "kustomer",
        "company",
      ],
    },
    externalId: {
      propDefinition: [
        "kustomer",
        "externalId",
      ],
    },
    username: {
      propDefinition: [
        "kustomer",
        "username",
      ],
    },
    signedUpAt: {
      propDefinition: [
        "kustomer",
        "signedUpAt",
      ],
    },
    lastActivityAt: {
      propDefinition: [
        "kustomer",
        "lastActivityAt",
      ],
    },
    lastCustomerActivityAt: {
      propDefinition: [
        "kustomer",
        "lastCustomerActivityAt",
      ],
    },
    lastSeenAt: {
      propDefinition: [
        "kustomer",
        "lastSeenAt",
      ],
    },
    avatarUrl: {
      propDefinition: [
        "kustomer",
        "avatarUrl",
      ],
    },
    externalIds: {
      propDefinition: [
        "kustomer",
        "externalIds",
      ],
    },
    sharedExternalIds: {
      propDefinition: [
        "kustomer",
        "sharedExternalIds",
      ],
    },
    emails: {
      propDefinition: [
        "kustomer",
        "emails",
      ],
    },
    sharedEmails: {
      propDefinition: [
        "kustomer",
        "sharedEmails",
      ],
    },
    phones: {
      propDefinition: [
        "kustomer",
        "phones",
      ],
    },
    sharedPhones: {
      propDefinition: [
        "kustomer",
        "sharedPhones",
      ],
    },
    whatsApps: {
      propDefinition: [
        "kustomer",
        "whatsApps",
      ],
    },
    facebookIds: {
      propDefinition: [
        "kustomer",
        "facebookIds",
      ],
    },
    instagramIds: {
      propDefinition: [
        "kustomer",
        "instagramIds",
      ],
    },
    socials: {
      propDefinition: [
        "kustomer",
        "socials",
      ],
    },
    sharedSocials: {
      propDefinition: [
        "kustomer",
        "sharedSocials",
      ],
    },
    urls: {
      propDefinition: [
        "kustomer",
        "urls",
      ],
    },
    locations: {
      propDefinition: [
        "kustomer",
        "locations",
      ],
    },
    locale: {
      propDefinition: [
        "kustomer",
        "locale",
      ],
    },
    timeZone: {
      propDefinition: [
        "kustomer",
        "timeZone",
      ],
    },
    tags: {
      propDefinition: [
        "kustomer",
        "tags",
      ],
    },
    sentiment: {
      propDefinition: [
        "kustomer",
        "sentiment",
      ],
    },
    birthdayAt: {
      propDefinition: [
        "kustomer",
        "birthdayAt",
      ],
    },
    gender: {
      propDefinition: [
        "kustomer",
        "gender",
      ],
    },
    createdAt: {
      propDefinition: [
        "kustomer",
        "createdAt",
      ],
    },
    importedAt: {
      propDefinition: [
        "kustomer",
        "importedAt",
      ],
    },
    rev: {
      propDefinition: [
        "kustomer",
        "rev",
      ],
    },
    defaultLang: {
      propDefinition: [
        "kustomer",
        "defaultLang",
      ],
    },
  },
  async run({ $ }) {
    const customerData = {
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

    const response = await this.kustomer.createCustomer(customerData);
    $.export("$summary", `Created customer with ID ${response.id}`);
    return response;
  },
};
