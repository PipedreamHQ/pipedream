import { parseObject } from "../../common/utils.mjs";
import whautomate from "../../whautomate.app.mjs";

export default {
  key: "whautomate-assign-tags-contact",
  name: "Assign Tags to Contact",
  description: "Assign one or more tags to an existing contact. [See the documentation](https://help.whautomate.com/product-guides/whautomate-rest-api/contacts#/v1-contacts-contactid-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whautomate,
    contactId: {
      propDefinition: [
        whautomate,
        "contactId",
      ],
    },
    contactTags: {
      propDefinition: [
        whautomate,
        "contactTags",
      ],
    },
  },
  async run({ $ }) {
    const contact = await this.whautomate.getContact(this.contactId);
    const response = await this.whautomate.updateContact({
      $,
      contactId: this.contactId,
      data: {
        ...contact,
        tags: [
          ...new Set([
            ...(contact.tags
              ? contact.tags
              : []),
            ...parseObject(this.contactTags),
          ]),
        ],
      },
    });
    $.export("$summary", `Successfully assigned tags to contact ${this.contactId}`);
    return response;
  },
};
