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
    groupTypeId: {
      type: "string",
      label: "Group Type ID",
      description: "The identifier of a group type",
      async options({
        orgId, prevContext,
      }) {
        const params = {
          includeAll: true,
        };
        if (prevContext?.from) {
          params.from = prevContext.from;
        }
        const { data } = await this.listGroupTypes({
          orgId,
          params: {
            ...params,
          },
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
            from: data[data.length - 1].id,
          },
        };
      },
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
    listJobs({
      orgId, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/org/${orgId}/job`,
        ...opts,
      });
    },
    listGroupTypes({
      orgId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/org/${orgId}/group-type`,
        ...opts,
      });
    },
    listGroups({
      orgId, type, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/org/${orgId}/group/${type}`,
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
    searchOrganization({
      orgId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/org/${orgId}/search`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      max,
    }) {
      let count = 0;
      do {
        const {
          data, next,
        } = await resourceFn(args);
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
          args.params = {
            ...args.params,
            from: next,
          };
        }
      } while (args.params?.from);
    },
  },
};
