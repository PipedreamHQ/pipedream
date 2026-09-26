import orshot from "../../orshot.app.mjs";
import { buildStudioRenderBody } from "../../common/render.mjs";

export default {
  key: "orshot-start-async-render",
  name: "Start Async Render",
  description: "Start a background render of a Studio template and get a job back immediately. Built for videos and long renders that would time out a normal request. Collect the result with **Get Render Job** or a webhook. [See the documentation](https://orshot.com/docs/api-reference/async-render-start)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    orshot,
    templateId: {
      propDefinition: [
        orshot,
        "studioTemplate",
      ],
    },
    modifications: {
      propDefinition: [
        orshot,
        "modifications",
      ],
      description: "Key-value pairs for your template's dynamic parameters. For multi-page templates, prefix keys with the page, e.g. `page2@title`.",
      optional: true,
    },
    format: {
      propDefinition: [
        orshot,
        "renderFormat",
      ],
      default: "mp4",
    },
    size: {
      propDefinition: [
        orshot,
        "sizePreset",
      ],
    },
    customSize: {
      propDefinition: [
        orshot,
        "customSize",
      ],
    },
    extraSizes: {
      propDefinition: [
        orshot,
        "extraSizes",
      ],
    },
    scale: {
      propDefinition: [
        orshot,
        "scale",
      ],
    },
    includePages: {
      propDefinition: [
        orshot,
        "includePages",
      ],
    },
    fileName: {
      propDefinition: [
        orshot,
        "fileName",
      ],
    },
    pdfOptions: {
      propDefinition: [
        orshot,
        "pdfOptions",
      ],
    },
    videoOptions: {
      propDefinition: [
        orshot,
        "videoOptions",
      ],
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "A public http(s) URL. Orshot POSTs `{ \"event\": \"render_job.finished\", \"job\": {...} }` to it when the job finishes (3 attempts). Polling stays the source of truth.",
      optional: true,
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Any string (max 1024 characters), echoed back on the job so you can correlate it, e.g. an order ID",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = buildStudioRenderBody({
      templateId: this.templateId,
      modifications: this.modifications,
      format: this.format,
      responseType: "url",
      mode: "async",
      size: this.size,
      customSize: this.customSize,
      extraSizes: this.extraSizes,
      scale: this.scale,
      includePages: this.includePages,
      fileName: this.fileName,
      pdfOptions: this.pdfOptions,
      videoOptions: this.videoOptions,
    });
    if (this.webhookUrl) {
      body.webhook_url = this.webhookUrl;
    }
    if (this.metadata) {
      body.metadata = this.metadata;
    }

    const job = await this.orshot.generateImageFromStudioTemplate({
      $,
      data: body,
    });
    $.export("$summary", `Started async render job ${job?.id} (${job?.status})`);
    return job;
  },
};
