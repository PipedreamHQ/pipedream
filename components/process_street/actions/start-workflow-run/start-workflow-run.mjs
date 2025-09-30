import processStreet from "../../process_street.app.mjs";
import _ from "lodash";

export default {
  key: "process_street-start-workflow-run",
  name: "Start Workflow Run",
  description: "Starts a workflow run. [See the docs here](https://public-api.process.st/api/v1.1/docs/index.html#operation/createWorkflowRun)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    processStreet,
    workflowId: {
      propDefinition: [
        processStreet,
        "workflowId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the workflow run",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date in the [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) of the workflow run",
      optional: true,
    },
    shared: {
      type: "boolean",
      label: "Shared",
      description: "Whether the workflow run is shared with other users",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = _.pickBy(_.pick(this, [
      "workflowId",
      "name",
      "dueDate",
      "shared",
    ]));
    const response = await this.processStreet.runWorkflow({
      $,
      data,
    });
    $.export("$summary", `Succesfully started workflow run ${this.name || ""}`);
    return response;
  },
};
