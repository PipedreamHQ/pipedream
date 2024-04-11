import frameio from "../../frameio.app.mjs";

export default {
  key: "frameio-create-project",
  name: "Create Project",
  description: "Establishes a new project on Frame.io. The title of the project needs to be inputted in the 'name' prop. Can optionally specify 'team_id' prop to determine the team that the project should be assigned.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    frameio,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project.",
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.frameio.createProject({
      name: this.name,
      teamId: this.teamId,
    });

    $.export("$summary", `Successfully created project '${this.name}'`);
    return response;
  },
};
