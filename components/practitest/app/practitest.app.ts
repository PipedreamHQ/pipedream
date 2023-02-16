import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateRequirementParams,
  CreateRequirementResponse,
  CreateRunParams,
  CreateRunResponse,
  GetInstancesResponse,
  GetIssuesResponse,
  GetProjectsResponse,
  GetTestsResponse,
  GetUsersResponse,
  HttpRequestParams,
  Instance,
  Issue,
  Project,
  Test,
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
    }: CreateRequirementParams): Promise<CreateRequirementResponse> {
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
    }: CreateRunParams): Promise<CreateRunResponse> {
      return this._httpRequest({
        method: "POST",
        url: `projects/${projectId}/runs.json`,
        data: {
          data: {
            type: "instances",
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
    async getInstances(projectId: number): Promise<Instance[]> {
      const { data }: GetInstancesResponse = await this._httpRequest({
        url: `/projects/${projectId}/instances.json`,
      });
      return data;
    },
    async getIssues(projectId: number): Promise<Issue[]> {
      const { data }: GetIssuesResponse = await this._httpRequest({
        url: `/projects/${projectId}/issues.json`,
      });
      return data;
    },
    async getTests(projectId: number): Promise<Test[]> {
      const { data }: GetTestsResponse = await this._httpRequest({
        url: `/projects/${projectId}/tests.json`,
      });
      return data;
    },
  },
  propDefinitions: {
    version: {
      type: "string",
      label: "Version",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "A hash of custom-fields with their value",
      optional: true,
    },
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
    instance: {
      type: "string",
      label: "Instance",
      description:
        "Choose an **Instance** from the list, or provide a custom *Instance ID*.",
      async options({ projectId }: { projectId: number; }) {
        const instance: Instance[] = await this.getInstances(projectId);
        return instance.map(
          ({
            attributes: { "name": label }, id: value,
          }) => ({
            label,
            value,
          }),
        );
      },
    },
  },
});
