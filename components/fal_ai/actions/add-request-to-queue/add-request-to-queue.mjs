import app from "../../fal_ai.app.mjs";

export default {
  key: "fal_ai-add-request-to-queue",
  name: "Add Request to Queue",
  description: "Adds a request to the queue for asynchronous processing, including specifying a webhook URL for receiving updates. [See the documentation](https://fal.ai/docs/model-endpoints/queue#queue-endpoints).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    appId: {
      propDefinition: [
        app,
        "appId",
      ],
    },
    data: {
      type: "object",
      label: "Data",
      description: "Additional data to include with the request. [See the documentation](https://fal.ai/models/fal-ai/lora/api#schema-input) for more input fields.",
      default: {
        model_name: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: "Photo of a european medieval 40 year old queen, silver hair, highly detailed face, detailed eyes, head shot, intricate crown, age spots, wrinkles",
      },
    },
    reRunEnabled: {
      type: "boolean",
      label: "Rerun Enabled",
      description: "Enable the step to rerun to retrieve the request response. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun/#flowrerun).",
      optional: true,
      reloadProps: true,
      default: false,
    },
  },
  additionalProps() {
    if (this.reRunEnabled) {
      return {
        reRunTimeoutInSecs: {
          type: "integer",
          label: "Rerun Timeout",
          description: "The time in seconds to wait before rerunning the step to retrieve the request response. Eg. `30`. [See the documentation](https://pipedream.com/docs/code/nodejs/rerun/#flowrerun).",
          optional: true,
          min: 10,
        },
      };
    }

    return {
      falWebhook: {
        type: "string",
        label: "Webhook URL",
        description: "The URL to receive updates via webhook.",
        optional: true,
      },
    };
  },
  methods: {
    addToQueue({
      appId, ...args
    } = {}) {
      return this.app.post({
        path: `/${appId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      context: {
        run: {
          runs,
          callback_request: callbackRequest,
        },
      },
    } = $;

    const {
      app,
      addToQueue,
      appId,
      data,
      falWebhook,
      reRunEnabled,
      reRunTimeoutInSecs,
    } = this;

    if (!reRunEnabled) {
      const response = await addToQueue({
        $,
        appId,
        params: {
          fal_webhook: falWebhook,
        },
        data,
      });

      $.export("$summary", `Successfully added the request to the queue with ID \`${response.request_id}\`.`);
      return response;
    }

    if (runs === 1) {
      const timeout = 1000 * (reRunTimeoutInSecs || 10);
      const { resume_url: resumeUrl } = $.flow.rerun(timeout, null, 1);

      return addToQueue({
        $,
        appId,
        params: {
          fal_webhook: resumeUrl,
        },
        data,
      });
    }

    const response = await app.getRequestResponse({
      $,
      appId,
      requestId: callbackRequest.body?.request_id,
    });

    $.export("$summary", "Successfully retrieved the request response.");
    return response;
  },
};
