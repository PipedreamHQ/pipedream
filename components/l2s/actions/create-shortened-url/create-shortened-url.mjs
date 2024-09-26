import l2s from "../../l2s.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "l2s-create-shortened-url",
  name: "Create Shortened URL",
  description: "Generates a shortened URL utilizing L2S capabilities. [See the documentation](https://docs.l2s.is/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    l2s,
    url: {
      propDefinition: [
        l2s,
        "url",
      ],
    },
    customKey: {
      propDefinition: [
        l2s,
        "customKey",
      ],
    },
    utmSource: {
      propDefinition: [
        l2s,
        "utmSource",
      ],
    },
    utmMedium: {
      propDefinition: [
        l2s,
        "utmMedium",
      ],
    },
    utmCampaign: {
      propDefinition: [
        l2s,
        "utmCampaign",
      ],
    },
    utmTerm: {
      propDefinition: [
        l2s,
        "utmTerm",
      ],
    },
    utmContent: {
      propDefinition: [
        l2s,
        "utmContent",
      ],
    },
    title: {
      propDefinition: [
        l2s,
        "title",
      ],
    },
    tags: {
      propDefinition: [
        l2s,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.l2s.shortenUrl({
      url: this.url,
      customKey: this.customKey,
      utmSource: this.utmSource,
      utmMedium: this.utmMedium,
      utmCampaign: this.utmCampaign,
      utmTerm: this.utmTerm,
      utmContent: this.utmContent,
      title: this.title,
      tags: this.tags,
    });

    $.export("$summary", "URL shortened successfully");
    return response;
  },
};
