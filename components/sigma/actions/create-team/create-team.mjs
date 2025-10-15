import app from "../../sigma.app.mjs";

export default {
  key: "sigma-create-team",
  name: "Create Team",
  description: "Create a team. [See the documentation](https://docs.sigmacomputing.com/#post-/v2/teams)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      description: "The name for the new team.",
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      description: "A description for the team.",
      propDefinition: [
        app,
        "description",
      ],
    },
    members: {
      type: "string[]",
      label: "Member IDs",
      description: "List of member IDs to add to the team.",
      propDefinition: [
        app,
        "memberId",
      ],
    },
    createTeamFolder: {
      type: "boolean",
      label: "Create Team Folder",
      description: "Whether to create a folder for the team.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility setting for the team.",
      options: [
        "public",
        "private",
      ],
      optional: true,
    },
  },
  methods: {
    createTeam(args = {}) {
      return this.app.post({
        path: "/teams",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createTeam,
      name,
      description,
      members,
      createTeamFolder,
      visibility,
    } = this;

    const response = await createTeam({
      $,
      data: {
        name,
        description,
        members,
        createTeamFolder,
        visibility,
      },
    });

    $.export("$summary", `Successfully created team with ID \`${response.teamId}\``);
    return response;
  },
};
