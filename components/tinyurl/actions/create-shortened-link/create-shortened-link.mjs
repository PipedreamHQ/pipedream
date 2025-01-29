import tinyurl from "../../tinyurl.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tinyurl-create-shortened-link",
  name: "Create Shortened Link",
  description: "Creates a new shortened link. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tinyurl,
    destinationUrl: {
      propDefinition: [
        tinyurl,
        "destinationUrl",
      ],
    },
    customAlias: {
      propDefinition: [
        tinyurl,
        "customAlias",
      ],
      optional: true,
    },
    expirationDate: {
      propDefinition: [
        tinyurl,
        "expirationDate",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        tinyurl,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tinyurl.createTinyURL();
    $.export("$summary", `Created TinyURL: ${response.url}`);
    return response;
  },
};
