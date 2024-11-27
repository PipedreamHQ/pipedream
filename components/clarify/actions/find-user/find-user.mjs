import app from "../../clarify.app.mjs";

export default {
  key: "clarify-find-user",
  name: "Find User",
  description: "Searches within the Clarify system for a user based on the given 'email' prop. Returns the found user. [See the documentation](https://api.getclarify.ai/swagger#/default/getUsers).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    workspace: {
      propDefinition: [
        app,
        "workspace",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user to search for.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user to search for.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user to search for.",
      optional: true,
    },
  },
  methods: {
    getUsers({
      workspace, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/workspaces/${workspace}/users`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getUsers,
      workspace,
      email,
      firstName,
      lastName,
    } = this;

    const response = await getUsers({
      $,
      workspace,
      params: {
        limit: 1000,
      },
    });

    const userFound = response.data.find(({ attributes }) =>
      attributes.email === email
      || attributes.firstName?.toLowerCase()?.includes(firstName?.toLowerCase())
      || attributes.lastName?.toLowerCase()?.includes(lastName?.toLowerCase())
      || attributes?.name?.first_name?.toLowerCase()?.includes(firstName?.toLowerCase())
      || attributes?.name?.last_name?.toLowerCase()?.includes(lastName?.toLowerCase()));

    if (!userFound) {
      $.export("$summary", "No user found with the given attributes.");
      return {
        success: false,
      };
    }

    $.export("$summary", "Successfully found user.");
    return userFound;
  },
};
