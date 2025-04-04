import { parseObject } from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-create-contact",
  name: "Create Contact",
  description: "Create a new contact in OpenPhone. [See the documentation](https://www.openphone.com/docs/api-reference/contacts/create-a-contact)",
  version: "0.0.2",
  type: "action",
  props: {
    openphone,
    firstName: {
      propDefinition: [
        openphone,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        openphone,
        "lastName",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        openphone,
        "company",
      ],
      optional: true,
    },
    role: {
      propDefinition: [
        openphone,
        "role",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        openphone,
        "emails",
      ],
      optional: true,
    },
    phoneNumbers: {
      propDefinition: [
        openphone,
        "phoneNumbers",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        openphone,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openphone.createContact({
      $,
      data: {
        defaultFields: {
          firstName: this.firstName,
          lastName: this.lastName,
          company: this.company,
          role: this.role,
          emails: parseObject(this.emails),
          phoneNumbers: parseObject(this.phoneNumbers),
        },
        customFields: parseObject(this.customFields),
      },
    });

    $.export("$summary", `Successfully created contact with ID: ${response.data.id}`);
    return response;
  },
};
