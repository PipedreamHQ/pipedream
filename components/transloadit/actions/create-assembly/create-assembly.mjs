import transloadit from "../../transloadit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "transloadit-create-assembly",
  name: "Create Assembly",
  description: "Create a new assembly to process files using a specified template and steps. [See the documentation](https://transloadit.com/docs/api/assemblies-post/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    transloadit,
    templateId: {
      propDefinition: [
        transloadit,
        "templateId",
      ],
      optional: true,
    },
    steps: {
      propDefinition: [
        transloadit,
        "steps",
      ],
      optional: true,
    },
    files: {
      propDefinition: [
        transloadit,
        "files",
      ],
    },
    notifyUrl: {
      propDefinition: [
        transloadit,
        "notifyUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.templateId && !this.steps) {
      throw new Error("Either 'templateId' or 'steps' must be provided.");
    }

    const response = await this.transloadit.createAssembly({
      templateId: this.templateId,
      steps: this.steps
        ? JSON.parse(this.steps)
        : undefined,
      files: this.files,
      notifyUrl: this.notifyUrl,
    });

    $.export("$summary", `Assembly created successfully with ID ${response.assembly_id}`);
    return response;
  },
};
