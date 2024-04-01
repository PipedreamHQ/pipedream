import parsehub from "../../parsehub.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "parsehub-get-project",
  name: "Get Project Details",
  description: "Retrieves the details of a specified project within the user's account. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#get-a-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    parsehub,
    projectId: {
      propDefinition: [
        parsehub,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.parsehub.getProjectDetails({
      projectId: this.projectId,
    });

    $.export("$summary", `Retrieved details for project ID: ${this.projectId}`);
    return response;
  },
};
