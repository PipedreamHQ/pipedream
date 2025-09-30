import { parseObject } from "../../common/utils.mjs";
import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-delete-contact",
  name: "Delete Contact",
  description: "Deletes a list of contacts. [See the documentation](https://documenter.getpostman.com/view/38507826/2sB2xEA8V5#fa88b9ed-84fe-49f7-acc1-a37169fc6cb0)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
