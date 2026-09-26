import { ConfigurationError } from "@pipedream/platform";
import orshot from "../../orshot.app.mjs";
import { buildStudioRenderBody } from "../../common/render.mjs";
import { waitForRender } from "../../common/wait.mjs";

export default {
  key: "orshot-render-studio-template",
  name: "Render from Studio Template",
  description: "Render an Orshot Studio template as an image, PDF or video, with Smart Resize, extra sizes, PDF and video options, and multi-page modifications. Turn on `Wait For Completion` for long videos. [See the documentation](https://orshot.com/docs/api-reference/render-from-studio-template)",
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
      description: "Key-value pairs for your template's dynamic parameters. For multi-page templates, prefix keys with the page, e.g. `page2@title`. Use **Get Studio Template Modifications** to see the keys.",
      optional: true,
    },
    format: {
      propDefinition: [
        orshot,
        "renderFormat",
      ],
    },
    responseType: {
      type: "string",
      label: "Response Type",
      description: "`url` returns a hosted file URL, `base64` returns the file inline",
      options: [
        "url",
        "base64",
      ],
      default: "url",
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
    waitForCompletion: {
      type: "boolean",
      label: "Wait For Completion",
      description: "Render in the background and pause this workflow until it finishes, instead of holding one HTTP request open. Recommended for videos. Orshot notifies the workflow by webhook, with polling as a fallback. Requires `url` response type. Only works in deployed workflows, not in test runs.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const body = buildStudioRenderBody({
      templateId: this.templateId,
      modifications: this.modifications,
      format: this.format,
      responseType: this.responseType,
      size: this.size,
      customSize: this.customSize,
      extraSizes: this.extraSizes,
      scale: this.scale,
      includePages: this.includePages,
      fileName: this.fileName,
      pdfOptions: this.pdfOptions,
      videoOptions: this.videoOptions,
    });

    if (this.waitForCompletion) {
      if (this.responseType !== "url") {
        throw new ConfigurationError("`Wait For Completion` requires the `url` response type");
      }
      const job = await waitForRender({
        $,
        app: this.orshot,
        body,
      });
      if (!job) {
        return;
      }
      if (job.status !== "succeeded") {
        throw new Error(`Render job ${job.id} ${job.status}: ${job.error || "no error message"}${job.error_code
          ? ` (${job.error_code})`
          : ""}`);
      }
      $.export("$summary", `Rendered studio template ${this.templateId} as ${this.format} (job ${job.id})`);
      return job;
    }

    const response = await this.orshot.generateImageFromStudioTemplate({
      $,
      data: body,
    });
    $.export("$summary", `Rendered studio template ${this.templateId} as ${this.format}`);
    return response;
  },
};
