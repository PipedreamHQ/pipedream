import sare from "../../sare.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sare-add-email",
  name: "Add Email Lead",
  description: "Add an email lead to SARE. Optionally, assign the lead to a group.",
  version: "0.0.1",
  type: "action",
  props: {
    sare,
    email: sare.propDefinitions.email,
    gsm: sare.propDefinitions.gsm,
    group: sare.propDefinitions.group,
  },
  async run({ $ }) {
    const response = await this.sare.addEmailLead({
      email: this.email,
      gsm: this.gsm,
      group: this.group,
    });

    $.export("$summary", `Successfully added email lead: ${this.email}`);
    return response;
  },
};
