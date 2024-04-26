import sare from "../../sare.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sare-remove-from-group",
  name: "Remove Email Leads from Groups",
  description: "Remove email leads from specified groups in SARE. [See the documentation](https://dev.sare.pl/rest-api/other/index.html)",
  version: "0.0.${ts}",
  type: "action",
  props: {
    sare,
    emails: {
      propDefinition: [
        sare,
        "emails",
      ],
    },
    groups: {
      propDefinition: [
        sare,
        "groups",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sare.removeEmailLeadsFromGroups({
      emails: this.emails,
      groups: this.groups,
    });
    $.export("$summary", "Successfully removed email leads from groups");
    return response;
  },
};
