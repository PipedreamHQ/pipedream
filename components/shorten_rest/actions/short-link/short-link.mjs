import shortenRest from "../../shorten_rest.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shorten_rest-short-link",
  name: "Shorten Link",
  description: "Shortens a given long URL into an alias. If the alias name is not provided, the system generates one. If the domain input is not provided, it defaults to short.fyi. [See the documentation](https://docs.shorten.rest/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shortenRest,
    longUrl: {
      propDefinition: [
        shortenRest,
        "longUrl",
      ],
    },
    aliasName: {
      propDefinition: [
        shortenRest,
        "aliasName",
      ],
      optional: true,
    },
    domainName: {
      propDefinition: [
        shortenRest,
        "domainName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const aliasName = this.aliasName || "@rnd";
    const domainName = this.domainName || "short.fyi";
    const response = await this.shortenRest.createAlias({
      longUrl: this.longUrl,
      aliasName,
      domainName,
    });

    $.export("$summary", `Shortened URL ${this.longUrl} to ${response.aliasName} under domain ${domainName}`);
    return response;
  },
};
