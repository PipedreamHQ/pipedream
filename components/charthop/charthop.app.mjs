import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "charthop",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "The identifier of an organization",
      async options({ prevContext }) {
        const params = prevContext?.from
          ? {
            from: prevContext.from,
          }
          : {};
        const { data } = await this.listOrgs({
          params,
        });
        const options = data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            from: options[options.length - 1].id,
          },
        };
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "The identifier of an employee",
      async options({
        orgId, prevContext,
      }) {
        const params = {
          includeAll: true,
        };
        if (prevContext?.from) {
          params.from = prevContext.from;
        }
        const { data } = await this.listPersons({
          orgId,
          params: {
            ...params,
          },
        });
        const options = data?.map(({
          id: value, name,
        }) => ({
          value,
          label: (`${name?.first} ${name?.last}`).trim(),
        })) || [];
        return {
          options,
          context: {
            from: data[data.length - 1].id,
          },
        };
      },
    },

    // Action: Modify Compensation Records
    modifyCompensationEmployeeId: {
      type: "string",
      label: "Employee ID",
      description: "ID of the employee for compensation update.",
    },
    modifyCompensationDetails: {
      type: "string",
      label: "Compensation Details",
      description: "Details of the compensation update. Provide as a JSON string.",
    },
    modifyCompensationEffectiveDate: {
      type: "string",
      label: "Effective Date",
      description: "Optional effective date for the compensation update.",
      optional: true,
    },
    modifyCompensationReason: {
      type: "string",
      label: "Reason for Change",
      description: "Optional reason for the compensation update.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.charthop.com";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    listOrgs(opts = {}) {
      return this._makeRequest({
        path: "/v1/org",
        ...opts,
      });
    },
    listPersons({
      orgId, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/org/${orgId}/person`,
        ...opts,
      });
    },
    getPerson({
      orgId, personId, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/org/${orgId}/person/${personId}`,
        ...opts,
      });
    },
    createPerson({
      orgId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v2/org/${orgId}/person`,
        ...opts,
      });
    },
    updatePerson({
      orgId, personId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/v2/org/${orgId}/person/${personId}`,
        ...opts,
      });
    },
  },
};
