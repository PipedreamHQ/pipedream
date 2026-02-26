import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-invite-user-to-project",
  name: "Invite User To Project",
  description: "Sends email to a person, inviting them to use one of your projects. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Sharing/Share-a-project)",
  version: "0.0.7",
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
