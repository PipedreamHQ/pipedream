import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ExtractTextParams,
  HttpRequestParams, Project,
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
  },
  methods: {
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: `https://${this.$auth.base_api_uri}/baas/v1`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async listProjects(): Promise<Project[]> {
      return this._httpRequest({
        url: "/project",
      });
    },
    async extractTextFromImage({
      projectId, ...args
    }: ExtractTextParams): Promise<object> {
      return this._httpRequest({
        url: `/project/${projectId}/ml/ocr`,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${args.data.getBoundary()}`,
        },
        ...args,
      });
    },
  },
});
