import bilflo from "../../bilflo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bilflo-create-client",
  name: "Create Client",
  description: "Creates a new client account in Bilflo. [See the documentation](https://developer.bilflo.com/documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    bilflo,
    businessName: {
      propDefinition: [
        bilflo,
        "businessName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bilflo.createClient({
      businessName: this.businessName,
    });
    $.export("$summary", `Successfully created new client account with business name ${this.businessName}`);
    return response;
  },
};
