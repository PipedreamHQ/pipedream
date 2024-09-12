import nioleads from "../../nioleads.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nioleads-find-email",
  name: "Find Email",
  description: "Finds a business email address using a full name and a website domain.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nioleads,
    fullName: {
      propDefinition: [
        nioleads,
        "fullName",
      ],
    },
    websiteDomain: {
      propDefinition: [
        nioleads,
        "websiteDomain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nioleads.findEmail(this.fullName, this.websiteDomain);
    $.export("$summary", `Found email: ${response.email}`);
    return response;
  },
};
