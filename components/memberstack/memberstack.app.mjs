import memberstackAdmin from "@memberstack/admin";

export default {
  type: "app",
  app: "memberstack",
  propDefinitions: {
    memberId: {
      type: "string",
      label: "Member",
      description: "Identifier of a member",
      async options({ after }) {
        const params = after
          ? {
            after,
          }
          : {};
        const { data: members } = await this.listMembers(params);
        if (!members) {
          return [];
        }
        const options = members.map(({
          id, auth,
        }) => ({
          label: auth.email,
          value: id,
        }));
        return {
          options,
          context: {
            after: options[options.length - 1].value,
          },
        };
      },
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Optional custom fields",
      optional: true,
    },
    metaData: {
      type: "object",
      label: "Metadata",
      description: "Optional metadata object",
      optional: true,
    },
  },
  methods: {
    _client() {
      return memberstackAdmin.init(this.$auth["secret_key"]);
    },
    async getMember(args = {}) {
      return this._client().members.retrieve(args);
    },
    async listMembers(args = {}) {
      return this._client().members.list(args);
    },
    async createMember(args = {}) {
      return this._client().members.create(args);
    },
    async updateMember(args = {}) {
      return this._client().members.update(args);
    },
    async deleteMember(args = {}) {
      return this._client().members.delete(args);
    },
    async paginate(resourceFn, resourceParams = {}, maxResults = 100) {
      const results = [];
      while (true) {
        const {
          data, hasNextPage, totalCount,
        } = await resourceFn(resourceParams);
        results.push(...data);
        if (!hasNextPage || results.length >= maxResults) {
          break;
        }
        resourceParams = {
          ...resourceParams,
          after: data[totalCount - 1].id,
        };
      }
      if (results.length > maxResults) {
        results.length = maxResults;
      }
      return results;
    },
  },
};
