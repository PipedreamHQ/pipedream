import clickfunnels from "../../clickfunnels.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clickfunnels-apply-tag-contact",
  name: "Apply Tag to Contact",
  description: "Applies a tag to a contact. If the contact doesn't currently have the specified tag, this action will add it. [See the documentation](https://developers.myclickfunnels.com/reference/createcontactsappliedtags)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clickfunnels,
    contactId: {
      propDefinition: [
        clickfunnels,
        "contactId",
      ],
    },
    tagId: {
      propDefinition: [
        clickfunnels,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const {
      contactId, tagId,
    } = this;
    const response = await this.clickfunnels.applyTagToContact({
      contactId,
      tagId,
    });
    $.export("$summary", `Successfully applied tag ${tagId} to contact ${contactId}`);
    return response;
  },
};
