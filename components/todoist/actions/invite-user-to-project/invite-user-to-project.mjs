import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-invite-user-to-project",
  name: "Invite User To Project",
  description: "Sends email to a person, inviting them to use one of your projects. [See the docs here](https://developer.todoist.com/sync/v9/#share-a-project)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
    email: {
      propDefinition: [
        todoist,
        "email",
      ],
    },
  },
  async run ({ $ }) {
    const {
      project,
      email,
    } = this;
    const data = {
      project_id: project,
      email,
    };
    const resp = await this.todoist.shareProject({
      $,
      data,
    });
    $.export("$summary", "Successfully invited user");
    return resp;
  },
};
