import { defineAction } from "@pipedream/types";
import expensify from "../../app/reversecontact.app";

export default defineAction({
  key: "reversecontact-enrich-profile",
  version: "0.0.1",
  name: "Enrich Profile",
  description: "Returns enriched profile information with the given email. [See docs here](https://docs.reversecontact.com/enriched_profile_check)",
  type: "action",
  props: {
    expensify,
    email: {
      label: "Email",
      description: "Email",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.expensify.enrichProfile({
      $,
      params: {
        mail: this.email,
      },
    });
    $.export("$summary", `${response.person ?
      "Successfully enriched profile." :
      "Profile cannot be enriched."} You have ${response.credits_left} credit(s) left.`);
    return response;
  },
});
