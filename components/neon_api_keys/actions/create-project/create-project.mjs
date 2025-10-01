import app from "../../neon_api_keys.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Project",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "neon_api_keys-create-project",
  description: "Creates a project. [See docs here](https://api-docs.neon.tech/reference/createproject)",
  type: "action",
  props: {
    app,
    name: {
      label: "Name",
      description: "The project name",
      type: "string",
    },
    regionId: {
      label: "Region ID",
      description: "The region identifier",
      type: "string",
      options: constants.REGIONS_ID,
    },
    pgVersion: {
      label: "PostgreSQL version",
      description: "The major PostgreSQL version number. Currently supported version are 14 and 15",
      type: "integer",
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      data: {
        project: {
          name: this.name,
          region_id: this.regionId,
          pg_version: this.pgVersion,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created project with ID ${response.project.id}`);
    }

    return response;
  },
};
