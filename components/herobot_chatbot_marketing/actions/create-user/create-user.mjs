import { parseObject } from "../../common/utils.mjs";
import app from "../../herobot_chatbot_marketing.app.mjs";

export default {
  key: "herobot_chatbot_marketing-create-user",
  name: "Create User",
  description: "Saves pertinent information about a new user. [See the documentation](https://my.herobot.app/api/swagger/#/Users/createNewContact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phone: {
      type: "string",
      label: "Phone",
      description: "The user's phone number.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name.",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The user's gender.",
      options: [
        "female",
        "male",
      ],
      optional: true,
    },
    actions: {
      type: "string",
      label: "Actions",
      description: "An stringified array of objects of the actions.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createUser({
      $,
      data: {
        phone: this.phone,
        first_name: this.firstName,
        last_name: this.lastName,
        gender: this.gender,
        actions: this.actions && parseObject(this.actions),
      },
    });

    $.export("$summary", `Successfully created new user with ID ${response.data?.id}`);
    return response;
  },
};
