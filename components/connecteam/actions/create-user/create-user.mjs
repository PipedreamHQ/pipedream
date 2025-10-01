import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import connecteam from "../../connecteam.app.mjs";

export default {
  key: "connecteam-create-user",
  name: "Create User",
  description: "Creates a new user profile in Connecteam. [See the documentation](https://developer.connecteam.com/reference/create_users_users_v1_users_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    connecteam,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The user's phone number. **Format : +(countrycode)(phone number)**.",
    },
    userType: {
      propDefinition: [
        connecteam,
        "userType",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email (mandatory for managers and owners).",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "An array of objects representing the user's custom fields. [See the documentation](https://developer.connecteam.com/reference/create_users_users_v1_users_post)",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "The user's archived status. Default is **False**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      connecteam,
      ...data
    } = this;

    if (data.customFields) data.customFields = parseObject(data.customFields);

    if ((data.userType === "manager" || data.userType === "owner") && !data.email) {
      throw new ConfigurationError("Email is mandatory for managers and owners.");
    }

    const response = await connecteam.createUser({
      $,
      data: [
        data,
      ],
    });
    $.export("$summary", `Successfully created user ${data.firstName} ${data.lastName}`);
    return response;
  },
};
