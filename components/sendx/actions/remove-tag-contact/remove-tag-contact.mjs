import sendx from "../../sendx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendx-remove-tag-contact",
  name: "Remove Tag from Contact",
  description: "De-associates a user-provided tag from a given contact in SendX. This action requires the contact's identification detail and the tag. This function aids in the management and classification of contacts.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendx,
    contactIdentification: sendx.propDefinitions.contactIdentification,
    tag: sendx.propDefinitions.tag,
  },
  async run({ $ }) {
    const response = await this.sendx.deAssociateTag({
      contactIdentification: this.contactIdentification,
      tag: this.tag,
    });
    $.export("$summary", `Successfully removed tag '${this.tag}' from contact '${this.contactIdentification}'`);
    return response;
  },
};
