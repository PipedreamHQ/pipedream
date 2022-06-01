import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "knack",
  methods: {
    getAuthKeys() {
      return {
        applicationId: this.$auth.application_id,
        apiKey: this.$auth.api_key,
      };
    },
    getBaseUrl() {
      return "https://api.knack.com/v1/objects";
    },
    getHeaders() {
      const {
        applicationId, apiKey,
      } = this.getAuthKeys();
      return {
        "X-Knack-Application-Id": applicationId,
        "X-Knack-REST-API-KEY": apiKey,
        "Content-Type": "application/json",
      };
    },
    async httpRequest($, params) {
      const {
        method,
        data,
        objectKey,
        recordId,
        page,
      } = params;

      let url = this.getBaseUrl() + `/${objectKey}/records`;

      if (recordId) url += `/${recordId}`;
      else if (page) url += `?page=${page}`;

      return axios($, {
        url,
        method,
        headers: this.getHeaders(),
        data,
      });
    },
    async createRecord($, params) {
      return this.httpRequest($, {
        method: "POST",
        ...params,
      });
    },
    async getRecord($, params) {
      if (params.recordId) {
        return this.httpRequest($, {
          method: "GET",
          ...params,
        });
      }

      return this.getAllRecords($, params);
    },
    async getAllRecords($, params) {
      const records = [];

      let page = 1;
      let response;

      do {
        response = await this.httpRequest($, {
          method: "GET",
          ...params,
          page,
        });

        if (response.records) records.push(...response.records);
        else throw new Error(response);
      } while (page++ < response.total_pages);

      return records;
    },
    async updateRecord($, params) {
      return this.httpRequest($, {
        method: "PATCH",
        ...params,
      });
    },
    async deleteRecord($, params) {
      return this.httpRequest($, {
        method: "DELETE",
        ...params,
      });
    },
  },
};
