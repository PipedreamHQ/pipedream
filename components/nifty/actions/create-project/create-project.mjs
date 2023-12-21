import nifty from "../../nifty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nifty-create-project",
  name: "Create Project",
  description: "Creates a new project in a designated portfolio. [See the documentation](https://openapi.niftypm.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nifty,
    portfolioId: {
      propDefinition: [
        nifty,
        "portfolioId",
      ],
    },
    projectName: {
      propDefinition: [
        nifty,
        "projectName",
      ],
    },
    projectDescription: {
      propDefinition: [
        nifty,
        "projectDescription",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nifty.createProject({
      portfolioId: this.portfolioId,
      projectName: this.projectName,
      projectDescription: this.projectDescription,
    });
    $.export("$summary", `Successfully created project ${this.projectName}`);
    return response;
  },
};
