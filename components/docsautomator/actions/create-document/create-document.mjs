import { parseObject } from "../../common/utils.mjs";
import docsautomator from "../../docsautomator.app.mjs";

export default {
  key: "docsautomator-create-document",
  name: "Create Document",
  description: "Generate a new document from a pre-existing template. [See the documentation](https://docs.docsautomator.co/integrations-api/docsautomator-api)",
  version: "0.0.1",
  type: "action",
  props: {
    docsautomator,
    automationId: {
      propDefinition: [
        docsautomator,
        "automationId",
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
    const response = await this.docsautomator.createDocument({
      $,
      data: {
        docId: this.automationId,
        documentName: this.documentName,
        recId: this.recId,
        taskId: this.taskId,
        data: parseObject(this.data),
      },
    });

    $.export("$summary", `Successfully created document with automation ID ${this.automationId}`);
    return response;
  },
};
