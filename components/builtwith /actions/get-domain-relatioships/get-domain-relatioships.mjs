import builtwith from "../../builtwith.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "builtwith-get-domain-relationships",
  name: "Get Domain Relationships",
  description: "Get the relationships of a domain with other websites. [See the documentation](https://api.builtwith.com/relationships-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    builtwith,
    apiKey: {
      propDefinition: [
        builtwith,
        "apiKey",
      ],
    },
    domain: {
      propDefinition: [
        builtwith,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.builtwith.getLinksBetweenWebsites({
      domain: this.domain,
    });
    $.export("$summary", `Retrieved relationships for domain ${this.domain}`);
    return response;
  },
};
