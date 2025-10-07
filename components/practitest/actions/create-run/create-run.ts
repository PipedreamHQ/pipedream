import practitest from "../../app/practitest.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import { DOCS } from "../../common/constants";
import {
  CreateRunParams, CreateRunResponse,
} from "../../common/types";

export default defineAction({
  name: "Create Run",
  description: `Create a run [See docs here](${DOCS.createRun})`,
  key: "practitest-create-run",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    practitest,
    projectId: {
      propDefinition: [
        practitest,
        "project",
      ],
    },
    instanceId: {
      propDefinition: [
        practitest,
        "instance",
        (c: { projectId: number; }) => ({
          projectId: c.projectId,
        }),
      ],
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
      propDefinition: [
        practitest,
        "version",
      ],
      description: "String of the run version",
    },
    customFields: {
      propDefinition: [
        practitest,
        "customFields",
      ],
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
  async run({ $ }): Promise<CreateRunResponse> {
    const {
      projectId,
      instanceId,
      exitCode,
      runDuration,
      automatedExecutionOutput,
      version,
      customFields,
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
    };

    [
      "steps",
      "files",
    ].forEach((prop) => {
      const value: string[] = this[prop];
      if (value) {
        try {
          params[prop] = {
            data: value.map((str) => JSON.parse(str)),
          };
        } catch (err) {
          throw new ConfigurationError(
            `**JSON parse error** - check if the \`${prop}\` prop is a valid JSON-stringified object`,
          );
        }
      }
    });

    const response: CreateRunResponse = await this.practitest.createRun(params);

    $.export("$summary", `Successfully created run (id ${response.data.id})`);

    return response;
  },
});
