import clickfunnels from "../../clickfunnels.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clickfunnels-remove-tag-contact",
  name: "Remove Tag from Contact",
  description: "Removes a specified tag from a contact. This action will take no effect if the specified tag doesn't exist on the contact. [See the documentation](https://developers.myclickfunnels.com/reference/removecontactsappliedtags)",
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

    const response = await this.clickfunnels.removeTagFromContact({
      contactId,
      tagId,
    });

    $.export("$summary", `Successfully removed tag ${tagId} from contact ${contactId}`);
    return response;
  },
};
