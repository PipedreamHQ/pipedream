import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  DetectObjectsParams,
  ExtractTextParams,
  HttpRequestParams, PerformFaceDetectionParams, PerformModerationParams, Project,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "zoho_catalyst",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "Select a **Project** or provide a custom *Project ID*.",
      async options() {
        const projects: Project[] = await this.listProjects();
        return projects.map(({
          project_name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    imagePath: {
      type: "string",
      label: "Image Path",
      description:
        "A file path in the `/tmp` directory. [See the documentation on working with files.](https://pipedream.com/docs/code/nodejs/working-with-files/)",
    },
    mode: {
      type: "string",
      label: "Mode",
      optional: true,
      default: "advanced",
    },
  },
  methods: {
    async _httpRequest({
      $ = this,
      headers,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: `https://${this.$auth.base_api_uri}/baas/v1`,
        headers: {
          ...headers,
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async listProjects(): Promise<Project[]> {
      const projects = await this._httpRequest({
        url: "/project",
      });
      return projects.data;
    },
    async detectObjectsInImage({
      projectId, ...args
    }: DetectObjectsParams): Promise<object> {
      return this._httpRequest({
        url: `/project/${projectId}/ml/detect-object`,
        method: "POST",
        ...args,
      });
    },
    async extractTextFromImage({
      projectId, ...args
    }: ExtractTextParams): Promise<object> {
      return this._httpRequest({
        url: `/project/${projectId}/ml/ocr`,
        method: "POST",
        ...args,
      });
    },
    async performImageModeration({
      projectId, ...args
    }: PerformModerationParams): Promise<object> {
      return this._httpRequest({
        url: `/project/${projectId}/ml/imagemoderation`,
        method: "POST",
        ...args,
      });
    },
    async performImageFaceDetection({
      projectId, ...args
    }: PerformFaceDetectionParams): Promise<object> {
      return this._httpRequest({
        url: `/project/${projectId}/ml/faceanalytics`,
        method: "POST",
        ...args,
      });
    },
  },
});
