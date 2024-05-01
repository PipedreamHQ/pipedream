import { axios } from "@pipedream/platform";
import flipando from "../../flipando.app.mjs";

export default {
  key: "flipando-run-app",
  name: "Run App",
  description: "Executes a chosen app within Flipando. Returns a 'task_id' to be used in fetching the outcome of this action. [See the documentation](https://flipandoai.notion.site/flipando-ai-api-integration-guide-6b508cfe1a5d4a249d20b926eac3a1d7)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flipando,
    appId: {
      propDefinition: [
        flipando,
        "appId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flipando.executeApp({
      appId: this.appId,
    });
    const taskId = response.id;
    $.export("$summary", `Successfully executed app with task ID: ${taskId}`);
    return taskId;
  },
};
