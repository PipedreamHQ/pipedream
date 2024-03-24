import builtwith from "../../builtwith.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "builtwith-get-domain-technologies",
  name: "Get Domain Technologies",
  description: "Retrieve the technology information of a website using the BuiltWith Domain API. [See the documentation](https://api.builtwith.com/domain-api)",
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
    const response = await this.builtwith.getTechnologyInformation({
      domain: this.domain,
    });
    $.export("$summary", `Retrieved technology information for domain ${this.domain}`);
    return response;
  },
};
