import practitest from "../../app/practitest.app";
import { defineAction } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import { CreateRunParams, Run } from "../../common/types";

export default defineAction({
  name: "Create Run",
  description: `Create a run [See docs here](${DOCS.createRun})`,
  key: "practitest-create-run",
  version: "0.0.1",
  type: "action",
  props: {
    practitest,
    projectId: {
      propDefinition: [practitest, "project"],
    },
    instanceId: {
      type: "integer",
      label: "Instance ID",
    },
    exitCode: {
      type: "integer",
      label: "Exit Code",
      description: "0 for passed, otherwise failed",
      optional: true,
    },
    runDuration: {
      type: "string",
      label: "Run Duration",
      description:
        "(HH:MM:SS), to update the run duration of a specific instance	",
      optional: true,
    },
    automatedExecutionOutput: {
      type: "string",
      label: "Automated Execution Output",
      description:
        "Text output string that will be shown in 'Execution output' field (up to 255 characters)",
      optional: true,
    },
    version: {
      propDefinition: [practitest, "version"],
    },
    customFields: {
      propDefinition: [practitest, "customFields"],
    },
    steps: {
      type: "string[]",
      label: "Steps",
      description: `An array of JSON-stringified steps objects. [See the docs for a detailed description and examples.](${DOCS.createRun})`,
      optional: true,
    },
    files: {
      type: "string[]",
      label: "Files",
      description: `An array of JSON-stringified file objects. The files' content should be encoded as base64. [See the docs for a detailed description and examples.](${DOCS.createRun})`,
      optional: true,
    },
  },
  async run({ $ }): Promise<Run> {
    const {
      projectId,
      instanceId,
      exitCode,
      runDuration,
      automatedExecutionOutput,
      version,
      customFields,
      steps,
      files,
    } = this;

    // parse steps and files as json strings

    const params: CreateRunParams = {
      $,
      projectId,
      attributes: {
        "instance-id": instanceId,
        "exit-code": exitCode,
        "run-duration": runDuration,
        "automated-execution-output": automatedExecutionOutput,
        version,
        "custom-fields": customFields,
      },
      steps: {
        data: steps,
      },
      files: {
        data: files,
      },
    };

    const data: Run = await this.practitest.createRun(params);

    $.export("$summary", `Successfully created run (id ${data.id})`);

    return data;
  },
});
