import knorish from "../../knorish.app.mjs";

export default {
  key: "knorish-create-user",
  name: "Create User",
  description: "Creates a new user on your Knorish site. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    knorish,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the user.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user.",
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile phone number of the user.",
      optional: true,
    },
    sendInvite: {
      type: "boolean",
      label: "Send Invite",
      description: "If the invitation will be send to the user.",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      knorish,
      sendInvite,
      ...data
    } = this;

    const response = await knorish.createUser({
      data: {
        sendinvite: sendInvite,
        ...data,
      },
    });

    $.export("$summary", `Successfully created user with ID: ${response.id}`);
    return response;
  },
};
