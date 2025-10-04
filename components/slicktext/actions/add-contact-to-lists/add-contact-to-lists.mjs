import { parseObject } from "../../common/utils.mjs";
import slicktext from "../../slicktext.app.mjs";

export default {
  key: "slicktext-add-contact-to-lists",
  name: "Add Contact To Lists",
  description: "Add a contact to lists. [See the documentation](https://api.slicktext.com/docs/v2/lists#scroll-to-add-contacts-to-lists)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slicktext,
    contactId: {
      propDefinition: [
        slicktext,
        "contactId",
      ],
    },
    listIds: {
      propDefinition: [
        slicktext,
        "listIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slicktext.addContactToLists({
      $,
      data: [
        {
          contact_id: this.contactId,
          lists: parseObject(this.listIds),
        },
      ],
    });

    $.export("$summary", `Successfully added contact with ID: ${this.contactId} to lists with ID: ${parseObject(this.listIds).join()}`);
    return response;
  },
};
