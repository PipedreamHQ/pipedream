import {
  normalizeNameValueList, parseObject,
} from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-create-contact",
  name: "Create Contact",
  description: "Create a new contact in OpenPhone. Example: call with firstName=\"Jane\", lastName=\"Doe\", phoneNumbers=`[{\"name\": \"Mobile\", \"value\": \"+15551234567\"}]` → returns the created contact record, including its `id`. [See the documentation](https://www.openphone.com/docs/api-reference/contacts/create-a-contact)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
          emails: normalizeNameValueList(parseObject(this.emails), "Email"),
          phoneNumbers: normalizeNameValueList(parseObject(this.phoneNumbers), "Phone"),
        },
        customFields: parseObject(this.customFields),
      },
    });

    $.export("$summary", `Successfully created contact with ID: ${response.data.id}`);
    return response;
  },
};
