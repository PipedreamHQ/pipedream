import sendx from "../../sendx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendx-add-tag-contact",
  name: "Add Tag to Contact",
  description: "Associates a user-provided tag with a specified contact in SendX. This action requires the contact's identification detail and the tag.",
  version: "0.0.1",
  type: "action",
  props: {
    sendx,
    contactIdentification: sendx.propDefinitions.contactIdentification,
    tag: {
      ...sendx.propDefinitions.tag,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.tag) {
      $.export("$summary", "No tag provided, no association made.");
      return;
    }
    const response = await this.sendx.associateTag({
      contactIdentification: this.contactIdentification,
      tag: this.tag,
    });
    $.export("$summary", `Successfully associated tag '${this.tag}' with contact '${this.contactIdentification}'`);
    return response;
  },
};
