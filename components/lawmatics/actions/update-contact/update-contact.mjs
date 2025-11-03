import lawmatics from "../../lawmatics.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "lawmatics-update-contact",
  name: "Update Contact",
  description: "Update a contact. [See the documentation](https://docs.lawmatics.com/#4734312c-854c-46c7-b8f9-962f775f1ab2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lawmatics,
    contactId: {
      propDefinition: [
        lawmatics,
        "contactId",
      ],
    },
    firstName: {
      propDefinition: [
        lawmatics,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        lawmatics,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        lawmatics,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        lawmatics,
        "phone",
      ],
    },
    notes: {
      propDefinition: [
        lawmatics,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.lawmatics.updateContact({
      $,
      contactId: this.contactId,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        notes: parseObject(this.notes),
      },
    });
    $.export("$summary", `Successfully updated contact: ${data.id}`);
    return data;
  },
};
