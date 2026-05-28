import app from "../../processplan.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "processplan-start-new-process",
  name: "Start New Process",
  description: "Starts a new process instance and populates its fields. Best used when initiating a new workflow. [See the documentation](https://techdocs.processplan.com/)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    processTemplateHeaderId: {
      propDefinition: [
        app,
        "processTemplateHeaderId",
      ],
      label: "Process Name",
      description: "The process template to start a new instance of",
    },
    fieldValues: {
      propDefinition: [
        app,
        "fieldValues",
      ],
    },
  },
  async run({ $ }) {
    const {
      processTemplateHeaderId, fieldValues,
    } = this;

    const response = await this.app.startProcessInstance({
      $,
      processTemplateHeaderId,
      data: {
        fields: utils.parseObject(fieldValues),
      },
    });

    $.export("$summary", "Successfully started process instance");
    return response;
  },
};
