import { parseObject } from "../../common/utils.mjs";
import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-delete-contact",
  name: "Delete Contact",
  description: "Deletes a list of contacts. [See the documentation](https://documenter.getpostman.com/view/32476792/2sA3dxFCaL)",
  version: "0.0.1",
  type: "action",
  props: {
    krispcall,
    contactIds: {
      propDefinition: [
        krispcall,
        "contactIds",
      ],
    },
  },
  async run({ $ }) {
    const parsedContacts = parseObject(this.contactIds);
    const response = await this.krispcall.deleteContacts({
      $,
      data: {
        contacts: parsedContacts,
      },
    });
    $.export("$summary", `Successfully deleted ${parsedContacts.length} contact(s)`);
    return response;
  },
};
