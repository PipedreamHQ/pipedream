import tinyurl from "../../tinyurl.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tinyurl-update-link-metadata",
  name: "Update Link Metadata",
  description: "Updates the metadata of an existing TinyURL. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tinyurl,
    linkIdOrAlias: {
      propDefinition: [
        "tinyurl",
        "linkIdOrAlias",
      ],
    },
    title: {
      propDefinition: [
        "tinyurl",
        "title",
      ],
      optional: true,
    },
    updateTags: {
      propDefinition: [
        "tinyurl",
        "updateTags",
      ],
      optional: true,
    },
    updateExpirationDate: {
      propDefinition: [
        "tinyurl",
        "updateExpirationDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tinyurl.updateTinyURLMetadata();
    $.export("$summary", `Updated TinyURL metadata for link: ${this.linkIdOrAlias}`);
    return response;
  },
};
