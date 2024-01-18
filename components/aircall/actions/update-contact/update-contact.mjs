import aircall from "../../aircall.app.mjs";
import common from "../common/common-create-update.mjs";

export default {
  ...common,
  name: "Update Contact",
  description: "Update a contact in Aircall. [See the documentation](https://developer.aircall.io/api-references/#update-a-contact)",
  key: "aircall-update-contact",
  version: "0.0.1",
  type: "action",
  props: {
    contactId: {
      propDefinition: [
        aircall,
        "contactId",
      ],
    },
    ...common.props,
  },
  async run({ $ }) {
    const data = this.getCommonData();
    const response = await this.aircall.createContact({
      $,
      contactId: this.contactId,
      data,
    });

    $.export("$summary", `Successfully updated contact (ID: ${this.contactId})`);

    return response;
  },
};
