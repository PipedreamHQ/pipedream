import shortApp from "../../short.app.mjs";

export default {
  key: "short-create-a-link",
  name: "Create a Short Link",
  description: "Create a Short Link. [See the docs](https://developers.short.io/reference/linkspost).",
  version: "0.0.1",
  type: "action",
  props: {
    shortApp,
    domain: {
      propDefinition: [
        shortApp,
        "domain",
      ],
    },
    originalURL: {
      propDefinition: [
        shortApp,
        "originalURL",
      ],
    },
    path: {
      propDefinition: [
        shortApp,
        "path",
      ],
    },
    title: {
      propDefinition: [
        shortApp,
        "title",
      ],
    },
    tags: {
      propDefinition: [
        shortApp,
        "tags",
      ],
    },
    allowDuplicates: {
      propDefinition: [
        shortApp,
        "allowDuplicates",
      ],
    },
    expiresAt: {
      propDefinition: [
        shortApp,
        "expiresAt",
      ],
    },
    expiredURL: {
      propDefinition: [
        shortApp,
        "expiredURL",
      ],
    },
    iphoneURL: {
      propDefinition: [
        shortApp,
        "iphoneURL",
      ],
    },
    androidURL: {
      propDefinition: [
        shortApp,
        "androidURL",
      ],
    },
    password: {
      propDefinition: [
        shortApp,
        "password",
      ],
    },
    utmSource: {
      propDefinition: [
        shortApp,
        "utmSource",
      ],
    },
    utmMedium: {
      propDefinition: [
        shortApp,
        "utmMedium",
      ],
    },
    utmCampaign: {
      propDefinition: [
        shortApp,
        "utmCampaign",
      ],
    },
    utmTerm: {
      propDefinition: [
        shortApp,
        "utmTerm",
      ],
    },
    utmContent: {
      propDefinition: [
        shortApp,
        "utmContent",
      ],
    },
    cloaking: {
      propDefinition: [
        shortApp,
        "cloaking",
      ],
    },
    redirectType: {
      propDefinition: [
        shortApp,
        "redirectType",
      ],
    },
  },
  async run({ $ }) {
    const {
      domain,
      originalURL,
      path,
      tags,
      allowDuplicates,
      expiresAt,
      expiredURL,
      iphoneURL,
      androidURL,
      password,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      cloaking,
      redirectType,
    } = this;

    const param = {
      domain,
      originalURL,
      path,
      tags,
      allowDuplicates,
      expiresAt,
      expiredURL,
      iphoneURL,
      androidURL,
      password,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      cloaking,
      redirectType,
    };

    const link = await this.shortApp.createLink($, param);
    $.export("$summary", `Successfully created the link: ${link.secureShortURL}`);
    return link;
  },
};
