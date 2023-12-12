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
    processFilters(filters) {
      return filters?.map((str) => JSON.parse(str)) ?? [];
    },
    processQueryParams(objParams) {
      const {
        sortField,
        sortOrder,
        filterType,
        filters,
      } = objParams;

      let queryParams = {
        sort_field: sortField,
        sort_order: sortOrder,
        filters:
          (filterType || filters) &&
          JSON.stringify({
            match: filterType ?? "and",
            rules: this.processFilters(filters),
          }),
      };

      let result = Object.entries(queryParams)
        .filter(([
          , value,
        ]) => value !== undefined)
        .map(([
          key,
          value,
        ]) => `${key}=${value}`)
        .join("&");

      return result
        ? `?${result}`
        : "";
    },
    async httpRequest($ = this, baseParams, queryParams = {}) {
      const {
        method,
        data,
        objectKey,
        recordId,
      } = baseParams;

      let url = this.getBaseUrl() + `/${objectKey}/records`;
      if (recordId) url += `/${recordId}`;

      url += this.processQueryParams(queryParams);

      return await axios($, {
        url: encodeURI(url),
        method,
        headers: this.getHeaders(),
        data,
      });
    },
    async createRecord($, baseParams) {
      return this.httpRequest($, {
        method: "POST",
        ...baseParams,
      });
    },
    async getRecord($, baseParams, queryParams) {
      if (baseParams.recordId) {
        return this.httpRequest($, {
          method: "GET",
          ...baseParams,
        });
      }

      return this.getAllRecords($, baseParams, queryParams);
    },
    async getAllRecords($, baseParams, queryParams, onePage = false) {
      const records = [];

      let page = 1;
      let response;

      do {
        response = await this.httpRequest(
          $,
          {
            method: "GET",
            ...baseParams,
          },
          {
            ...queryParams,
            page,
          },
        );

        if (response.records) records.push(...response.records);
        else throw new Error(response);
      } while (page++ < response.total_pages && !onePage);

      return records;
    },
    async updateRecord($, baseParams) {
      return this.httpRequest($, {
        method: "PUT",
        ...baseParams,
      });
    },
    async deleteRecord($, baseParams) {
      return this.httpRequest($, {
        method: "DELETE",
        ...baseParams,
      });
    },
  },
};
