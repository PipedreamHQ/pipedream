import app from "../../supercast.app.mjs";

export default {
  key: "supercast-create-creator",
  name: "Create a Channel Creator",
  description: "Creates a new channel creator on Supercast. [See the documentation](https://supercast.readme.io/reference/postcreators)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the creator",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the creator",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the creator",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the creator account. On creation, if left unset Creator must be managed entirely through API.",
      optional: true,
    },
  },
  methods: {
    createChannelCreator(args = {}) {
      return this.app.post({
        path: "/creators",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createChannelCreator,
      email,
      firstName,
      lastName,
      password,
    } = this;

    const response = await createChannelCreator({
      $,
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      },
    });

    $.export("$summary", `Successfully created channel creator with ID ${response.id}`);
    return response;
  },
};
