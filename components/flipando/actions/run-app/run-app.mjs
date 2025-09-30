import flipando from "../../flipando.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "flipando-run-app",
  name: "Run App",
  description: "Executes a chosen app within Flipando. Returns a 'task_id' to be used in fetching the outcome of this action. [See the documentation]([See the documentation](https://flipandoai.notion.site/Flipando-ai-API-Integration-Guide-6b508cfe1a5d4a249d20b926eac3a1d7#36b02715e5f440c9b21952b668e0e70c))",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flipando,
    appId: {
      propDefinition: [
        flipando,
        "appId",
      ],
      reloadProps: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the task is completed",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.appId) {
      return props;
    }
    const {
      results: {
        inputs, has_docs: hasDocs,
      },
    } = await this.flipando.getApp({
      appId: this.appId,
    });
    for (const input of inputs) {
      props[input.name] = {
        type: "string",
        label: input.name,
        description: `Example: ${input.value}`,
      };
    }
    if (hasDocs) {
      props.file = {
        type: "string",
        label: "File Path or URL",
        description: "Provide a file URL or path to a document file in the `/tmp` directory.",
      };
      props.fileDescription = {
        type: "string",
        label: "File Description",
        description: "Description of the file being uploaded",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      flipando,
      appId,
      waitForCompletion,
      file,
      fileDescription,
      ...inputs
    } = this;

    let data = new FormData();
    data.append("inputs_data", JSON.stringify(inputs));
    if (file) {
      const {
        stream,
        metadata,
      } = await getFileStreamAndMetadata(file);
      data.append("file_description", fileDescription);
      data.append("file", stream, {
        filename: metadata.name,
      });
    }

    let response = await flipando.executeApp({
      $,
      appId,
      data,
      headers: data.getHeaders(),
    });

    if (waitForCompletion) {
      const { results: { id: taskId } } = response;
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response?.code !== 200) {
        response = await flipando.getTask({
          $,
          taskId,
        });
        await timer(3000);
      }
    }

    $.export("$summary", `Successfully executed app with ID: ${appId}`);
    return response;
  },
};
