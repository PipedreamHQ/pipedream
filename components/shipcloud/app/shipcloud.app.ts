import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { HttpRequestParams } from "../types/requestParams";

export default defineApp({
  type: "app",
  app: "shipcloud",
  methods: {
    _baseUrl(): string {
      return "https://api.shipcloud.io/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        auth: {
          username: this.$auth.api_key,
          password: '',
        },
        ...args,
      });
    },
    // async hookResponseRequest(apiUrl: string): Promise<object> {
    //   if (!(apiUrl && apiUrl.startsWith(this._baseUrl()))) {
    //     return {
    //       noUrl: true,
    //     };
    //   }

    //   return this._httpRequest({
    //     url: apiUrl,
    //   });
    // },
    // async createHook(data: CreateHookParams): Promise<Webhook> {
    //   return this._httpRequest({
    //     endpoint: "/hooks",
    //     method: "POST",
    //     data,
    //   });
    // },
    // async deleteHook({ key }: DeleteHookParams): Promise<number> {
    //   return this._httpRequest({
    //     endpoint: `/hooks/${key}`,
    //     method: "DELETE",
    //   });
    // },
    // async listCompanies(): Promise<Company[]> {
    //   const response = await this._httpRequest({
    //     endpoint: "/companies",
    //   });

    //   return response.companies;
    // },
    // async getCompany({
    //   id, ...params
    // }: GetObjectParams): Promise<Company> {
    //   return this._httpRequest({
    //     endpoint: `/companies/${id}`,
    //     ...params,
    //   });
    // },
  },
  propDefinitions: {
    // companyId: {
    //   type: "integer",
    //   label: "Company",
    //   description: `Select a **Company** from the list.
    //     \\
    //     Alternatively, you can provide a custom *Company ID*.`,
    //   async options() {
    //     const companies: Company[] = await this.listCompanies();
    //     return companies.map(({
    //       company_name, id,
    //     }) => ({
    //       label: company_name,
    //       value: id,
    //     }));
    //   },
    // },
  },
});
