import { axios } from "@pipedream/platform";
import {
  RENDER_FORMATS, SIZE_PRESETS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "orshot",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to render",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.title,
          value: template.id,
        }));
      },
    },
    studioTemplateId: {
      type: "string",
      label: "Studio Template ID",
      description: "The ID of the studio template to render. You can find this on the template playground page.",
    },
    responseType: {
      type: "string",
      label: "Response Type",
      description: "Type of response to return",
      options: [
        {
          label: "Base64",
          value: "base64",
        },
        {
          label: "Binary",
          value: "binary",
        },
        {
          label: "URL",
          value: "url",
        },
      ],
      default: "base64",
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "Format of the rendered image",
      options: [
        {
          label: "PNG",
          value: "png",
        },
        {
          label: "JPG",
          value: "jpg",
        },
        {
          label: "JPEG",
          value: "jpeg",
        },
        {
          label: "WebP",
          value: "webp",
        },
      ],
      default: "png",
    },
    modifications: {
      type: "object",
      label: "Template Modifications",
      description: "Key-value pairs for template modifications. The keys should match the modification keys available for your template.",
    },
    studioTemplate: {
      type: "string",
      label: "Studio Template",
      description: "The Studio template ID to use, e.g. `12345`. Use **List Studio Templates** to find the template ID (the `id` field).",
      async options({ page }) {
        const { data = [] } = await this.listStudioTemplates({
          params: {
            page: page + 1,
            limit: 40,
          },
        });
        return data.map((template) => ({
          label: template.name || `Template ${template.id}`,
          value: String(template.id),
        }));
      },
    },
    renderFormat: {
      type: "string",
      label: "Format",
      description: "Output format, e.g. `png`. Image formats render a still, `pdf` renders a document, and `mp4`, `webm`, `mov`, `mkv` or `gif` render a video (the template needs video or animated elements).",
      options: RENDER_FORMATS,
      default: "png",
    },
    sizePreset: {
      type: "string",
      label: "Resize To",
      description: "Smart Resize preset, e.g. `instagram-story`. Renders the same design at a different canvas size. Use this or `Custom Size`, not both. [See the documentation](https://orshot.com/docs/api-reference/render-from-studio-template#smart-resize)",
      options: SIZE_PRESETS,
      optional: true,
    },
    customSize: {
      type: "string",
      label: "Custom Size",
      description: "Smart Resize to an exact size, as `WIDTHxHEIGHT` in pixels (10 to 5000), e.g. `1200x630`. Use this or `Resize To`, not both.",
      optional: true,
    },
    extraSizes: {
      type: "string[]",
      label: "Extra Sizes",
      description: "Also render the design at these extra sizes in the same call. Each entry is a preset (e.g. `instagram-story`) or `WIDTHxHEIGHT`. Image formats with `url` or `base64` only. Each output gains an `extraSizes` array. Extra outputs are billed like pages.",
      options: SIZE_PRESETS,
      optional: true,
    },
    scale: {
      type: "string",
      label: "Scale",
      description: "Output scale multiplier, e.g. `2`. `1` is the template size and `2` doubles it.",
      optional: true,
    },
    includePages: {
      type: "integer[]",
      label: "Include Pages",
      description: "Multi-page templates only: render just these page numbers (1-based), e.g. `1` and `3`.",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Custom output file name without the extension, e.g. `invoice-2026`. Applies to `url` responses.",
      optional: true,
    },
    pdfOptions: {
      type: "object",
      label: "PDF Options",
      description: "PDF options, e.g. `{ \"dpi\": 300 }`. Keys include `title`, `margin`, `dpi`, `colorMode` (`rgb` or `cmyk`), `imageFormat`, `imageQuality`, `maxImageDpi`, `rangeFrom`, and `rangeTo`. [See the documentation](https://orshot.com/docs/pdf-generation/pdf-options)",
      optional: true,
    },
    videoOptions: {
      type: "object",
      label: "Video Options",
      description: "Video options, e.g. `{ \"fps\": 30, \"muted\": true }`. Keys include `fps`, `quality`, `trimStart`, `trimEnd`, `duration`, `muted`, `combinePages`, `pageTransition`, `subtitleSource`, and subtitle styling. [See the documentation](https://orshot.com/docs/video-generation/video-options)",
      optional: true,
    },
    renderJobId: {
      type: "string",
      label: "Render Job ID",
      description: "The render job ID, e.g. `12345`, returned by **Start Async Render**.",
    },
    socialAccountIds: {
      type: "string[]",
      label: "Social Accounts",
      description: "The connected social account IDs, e.g. `[\"12345\"]`. Use **List Social Accounts** to find the account IDs (the `id` field).",
      async options() {
        const { data = [] } = await this.listSocialAccounts();
        return data.map((account) => ({
          label: `${account.platform}: ${account.account_name || account.account_username || account.id}`,
          value: String(account.id),
        }));
      },
    },
    workflowId: {
      type: "string",
      label: "Workflow",
      description: "The workflow ID to use, e.g. `12345`. Use **List Workflows** to find the workflow ID (the `id` field). The Workflows API is available on the Enterprise plan.",
      async options({ page }) {
        const limit = 50;
        const { workflows = [] } = await this.listWorkflows({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return workflows.map((workflow) => ({
          label: workflow.name || `Workflow ${workflow.id}`,
          value: String(workflow.id),
        }));
      },
    },
    workflowRunId: {
      type: "string",
      label: "Run ID",
      description: "The workflow run ID, e.g. `12345`, returned by **Run Workflow**.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return per page, e.g. `10`",
      min: 1,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.orshot.com/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.token}`,
          "Content-Type": "application/json",
        },
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    getTemplateModifications(opts = {}) {
      return this._makeRequest({
        path: "/templates/modifications",
        ...opts,
      });
    },
    getStudioTemplateModifications(opts = {}) {
      return this._makeRequest({
        path: "/studio/template/modifications",
        ...opts,
      });
    },
    generateImageFromLibraryTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate/images",
        ...opts,
      });
    },
    generateImageFromStudioTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/studio/render",
        ...opts,
      });
    },
    listStudioTemplates(opts = {}) {
      return this._makeRequest({
        path: "/studio/templates/all",
        ...opts,
      });
    },
    getRenderJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/studio/render-jobs/${encodeURIComponent(jobId)}`,
        ...opts,
      });
    },
    listRenderJobs(opts = {}) {
      return this._makeRequest({
        path: "/studio/render-jobs",
        ...opts,
      });
    },
    listSocialAccounts(opts = {}) {
      return this._makeRequest({
        path: "/social/accounts",
        ...opts,
      });
    },
    publishToSocial(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/social/publish",
        ...opts,
      });
    },
    createSignedUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/signed-url/create",
        ...opts,
      });
    },
    listWorkflows(opts = {}) {
      return this._makeRequest({
        path: "/workflows",
        ...opts,
      });
    },
    runWorkflow({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workflows/${encodeURIComponent(workflowId)}/run`,
        ...opts,
      });
    },
    getWorkflowRun({
      workflowId, runId, ...opts
    }) {
      return this._makeRequest({
        path: `/workflows/${encodeURIComponent(workflowId)}/runs/${encodeURIComponent(runId)}`,
        ...opts,
      });
    },
  },
};
