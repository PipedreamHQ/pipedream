import app from "../../brainbase_labs.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "brainbase_labs-make-voice-batch-calls",
  name: "Make Voice Batch Calls",
  description: "Make batch calls for a voice deployment. [See the documentation](https://docs.usebrainbase.com/api-reference/voice-deployments/make-batch-calls-for-a-voice-deployment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
    deploymentId: {
      propDefinition: [
        app,
        "deploymentId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
    },
    data: {
      type: "object",
      label: "Data",
      description: "Array of data objects with string key-value pairs for each call. Example: `[{\"name\": \"John\", \"phone\": \"+1234567890\"}, {\"name\": \"Jane\", \"phone\": \"+0987654321\"}]`",
    },
    batchSize: {
      type: "integer",
      label: "Batch Size",
      description: "Number of calls to process in each batch",
      min: 1,
      optional: true,
    },
    batchIntervalMinutes: {
      type: "integer",
      label: "Batch Interval (Minutes)",
      description: "Time interval between batches in minutes",
      min: 1,
      optional: true,
    },
    wsUrl: {
      type: "string",
      label: "WebSocket URL",
      description: "WebSocket URL for real-time updates",
      optional: true,
    },
    condition: {
      type: "string",
      label: "Condition",
      description: "Optional condition filter for the batch calls",
      optional: true,
    },
    extractions: {
      type: "string",
      label: "Extractions",
      description: "Optional extractions configuration",
      optional: true,
    },
    additionalData: {
      type: "string",
      label: "Additional Data",
      description: "Optional additional data for the batch calls",
      optional: true,
    },
  },
  async run({ $ }) {
    const requestData = {
      data: parseObject(this.data),
      batch_size: this.batchSize,
      batch_interval_minutes: this.batchIntervalMinutes,
      wsUrl: this.wsUrl,
    };

    if (this.condition) requestData.condition = this.condition;
    if (this.extractions) requestData.extractions = this.extractions;
    if (this.additionalData) requestData.additional_data = this.additionalData;

    const response = await this.app.makeVoiceBatchCalls({
      $,
      workerId: this.workerId,
      deploymentId: this.deploymentId,
      data: requestData,
    });

    $.export(
      "$summary",
      `Successfully initiated batch calls for ${this.data.length} recipient(s)`,
    );
    return response;
  },
};
