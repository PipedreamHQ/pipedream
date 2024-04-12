import frameio from "../../frameio.app.mjs";
import { parseObjectValues } from "../../common/utils.mjs";

export default {
  key: "frameio-create-project",
  name: "Create Project",
  description: "Creates a new project on Frame.io. [See the documentation](https://developer.frame.io/api/reference/operation/createProject/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    frameio,
    teamId: {
      propDefinition: [
        frameio,
        "teamId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project.",
      optional: true,
    },
    private: {
      type: "boolean",
      label: "Private",
      description: "If true, the project is private to the creating user",
      optional: true,
    },
    projectPreferences: {
      type: "object",
      label: "Project Preferences",
      description: "Preferences to set for the project. [See the documentation](https://developer.frame.io/api/reference/operation/createProject/) for valid properties.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.frameio.createProject({
      $,
      data: {
        team_id: this.teamId,
        name: this.name,
        private: this.private,
        project_preferences: parseObjectValues(this.projectPreferences),
      },
    });

    $.export("$summary", `Successfully created project (ID: ${response.id})`);
    return response;
  },
};
