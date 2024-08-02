import whautomate from "../../whautomate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "whautomate-assign-tags-contact",
  name: "Assign Tags to Contact",
  description: "Assign one or more tags to an existing contact. [See the documentation](https://help.whautomate.com/product-guides/whautomate-rest-api/contacts)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whautomate,
    contactId: {
      propDefinition: [
        whautomate,
        "contactId",
      ],
    },
    tags: {
      propDefinition: [
        whautomate,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whautomate.assignTagsToContact({
      contactId: this.contactId,
      tags: this.tags,
    });
    $.export("$summary", `Successfully assigned tags to contact ${this.contactId}`);
    return response;
  },
};
