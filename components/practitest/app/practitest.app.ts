import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateRequirementParams,
  CreateRunParams,
  GetProjectsResponse,
  GetUsersResponse,
  HttpRequestParams,
  Project,
  User,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "practitest",
  methods: {
    _apiKey(): string {
      return this.$auth.api_token;
    },
    _baseUrl(): string {
      return "https://api.practitest.com/api/v2";
    },
    async _httpRequest({
      $ = this,
      params,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          ...params,
          api_token: this._apiKey(),
        },
        ...args,
      });
    },
    async createRequirement({
      projectId, ...args
    }: CreateRequirementParams) {
      return this._httpRequest({
        method: "POST",
        url: `projects/${projectId}/requirements.json`,
        data: {
          data: {
            type: "requirements",
            ...args,
          },
        },
      });
    },
    async createRun({
      projectId, ...args
    }: CreateRunParams) {
      return this._httpRequest({
        method: "POST",
        url: `projects/${projectId}/runs.json`,
        data: {
          data: {
            type: "run",
            ...args,
          },
        },
      });
    },
    async getProjects(): Promise<Project[]> {
      const { data }: GetProjectsResponse = await this._httpRequest({
        url: "/projects.json",
      });
      return data;
    },
    async getUsers(): Promise<User[]> {
      const { data }: GetUsersResponse = await this._httpRequest({
        url: "/users.json",
      });
      return data;
    },
  },
  propDefinitions: {
    project: {
      type: "string",
      label: "Project",
      description:
        "Choose a **Project** from the list, or provide a custom *Project ID*.",
      async options() {
        const projects: Project[] = await this.getProjects();
        return projects.map(({
          attributes: { name: label }, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    user: {
      type: "string",
      label: "User",
      description:
        "Choose a **User** from the list, or provide a custom *User ID*.",
      async options() {
        const user: User[] = await this.getUsers();
        return user.map(
          ({
            attributes: { "display-name": label }, id: value,
          }) => ({
            label,
            value,
          }),
        );
      },
    },
  },
});
