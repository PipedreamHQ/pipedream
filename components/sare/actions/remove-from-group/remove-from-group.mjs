import { parseObject } from "../../common/utils.mjs";
import sare from "../../sare.app.mjs";

export default {
  key: "sare-remove-from-group",
  name: "Remove Email from Groups",
  description: "Remove email from specified groups in SARE. [See the documentation](https://dev.sare.pl/rest-api/other/index.html#post-/group/remove_emails)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.sare.removeEmailFromGroups({
      data: {
        emails: this.emails && parseObject(this.emails),
        groups: this.groups && parseObject(this.groups),
      },
    });
    $.export("$summary", "Successfully removed emails from groups");
    return response;
  },
};
