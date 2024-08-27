import docsautomator from "../../docsautomator.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "docsautomator-create-document",
  name: "Create Document",
  description: "Generate a new document from a pre-existing template. [See the documentation](https://docs.docsautomator.co/integrations-api/docsautomator-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    docsautomator,
    templateId: {
      propDefinition: [
        docsautomator,
        "templateId",
      ],
    },
    documentName: {
      propDefinition: [
        docsautomator,
        "documentName",
      ],
    },
    recId: {
      propDefinition: [
        docsautomator,
        "recId",
      ],
    },
    taskId: {
      propDefinition: [
        docsautomator,
        "taskId",
      ],
    },
    data: {
      propDefinition: [
        docsautomator,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docsautomator.duplicateGoogleDocTemplate({
      templateId: this.templateId,
      documentName: this.documentName,
      recId: this.recId,
      taskId: this.taskId,
      data: this.data,
    });

    $.export("$summary", `Successfully created document with template ID ${this.templateId}`);
    return response;
  },
};
