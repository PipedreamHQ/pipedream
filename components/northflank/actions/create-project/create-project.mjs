import northflank from "../../northflank.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "northflank-create-project",
  name: "Create Project",
  description: "Creates a new project on Northflank. [See the documentation](https://northflank.com/docs/v1/api/projects/create-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    northflank,
    projectName: northflank.propDefinitions.projectName,
    projectDescription: northflank.propDefinitions.projectDescription,
    projectColor: northflank.propDefinitions.projectColor,
    projectRegion: northflank.propDefinitions.projectRegion,
    clusterId: {
      ...northflank.propDefinitions.clusterId,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.northflank.createProject({
      projectName: this.projectName,
      projectDescription: this.projectDescription,
      projectColor: this.projectColor,
      projectRegion: this.projectRegion,
      clusterId: this.clusterId,
    });

    $.export("$summary", `Successfully created project ${this.projectName}`);
    return response;
  },
};
