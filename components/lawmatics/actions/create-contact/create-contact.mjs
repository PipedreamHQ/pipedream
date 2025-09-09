import lawmatics from "../../lawmatics.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "lawmatics-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the documentation](https://docs.lawmatics.com/#714b9275-b769-4195-9954-2095479b9993)",
  version: "0.0.1",
  type: "action",
  props: {
    lawmatics,
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
    const { data } = await this.lawmatics.createContact({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        notes: parseObject(this.notes),
      },
    });
    $.export("$summary", `Successfully created contact: ${data.id}`);
    return data;
  },
};
