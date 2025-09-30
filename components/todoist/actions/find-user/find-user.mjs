import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-find-user",
  name: "Find User",
  description: "Searches by email for a user who is connected/shared with your account. [See the docs here](https://developer.todoist.com/sync/v9/#read-resources)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    email: {
      propDefinition: [
        todoist,
        "email",
      ],
    },
  },
  async run ({ $ }) {
    const { email } = this;
    const results = await this.todoist.syncCollaborators();
    const { collaborators } = results;
    const result = collaborators.find((user) => user.email == email);
    $.export("$summary", result
      ? "User Found"
      : "User Not Found");
    return result;
  },
};
