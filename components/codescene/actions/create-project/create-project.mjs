import codescene from "../../codescene.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "codescene-create-project",
  name: "Create a New Project",
  description: "Creates a new project in CodeScene. [See the documentation](https://codescene.io/docs/integrations/public-api.html?highlight=api#new-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    codescene,
    developerConfiguration: {
      propDefinition: [
        codescene,
        "developerConfiguration",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.codescene.createNewProject({
      developerConfiguration: this.developerConfiguration,
    });

    $.export("$summary", `Successfully created a new project with Developer Configuration ID ${this.developerConfiguration}`);
    return response;
  },
};
