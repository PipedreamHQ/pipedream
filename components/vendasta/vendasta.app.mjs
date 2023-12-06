import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "vendasta",
  propDefinitions: {
    partnerId: {
      type: "string",
      label: "Partner",
      description: "Identifier of a partner",
      async options({ prevContext }) {
        const args = prevContext?.cursor
          ? {
            url: prevContext.cursor,
          }
          : {};
        const {
          links, data,
        } = await this.listBusinessLocations(args);
        const options = data?.map(({
          id, attributes,
        }) => ({
          value: id,
          label: attributes.name,
        })) || [];
        return {
          options,
          context: {
            cursor: links.next,
          },
        };
      },
    },
    businessLocationId: {
      type: "string",
      label: "Business Location",
      description: "Identifier of a business location",
      async options({
        partnerId, prevContext,
      }) {
        const args = {
          params: {
            "filter[businessPartner.id]": partnerId,
          },
        };
        if (prevContext?.cursor) {
          args.url = prevContext.cursor;
        }
        const {
          links, data,
        } = await this.listBusinessLocations(args);
        const options = data?.map(({
          id, attributes,
        }) => ({
          value: id,
          label: attributes.name,
        })) || [];
        return {
          options,
          context: {
            cursor: links.next,
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer",
      description: "Identifier of a customer",
      async options({
        businessLocationId, prevContext,
      }) {
        const args = {
          params: {
            "filter[businessLocation.id]": businessLocationId,
          },
        };
        if (prevContext?.cursor) {
          args.url = prevContext.cursor;
        }
        const {
          links, data,
        } = await this.listCustomers(args);
        const options = data?.map(({
          id, attributes,
        }) => ({
          value: id,
          label: attributes.emailAddresses[0],
        })) || [];
        return {
          options,
          context: {
            cursor: links.next,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the customer",
    },
    givenName: {
      type: "string",
      label: "Given Name",
      description: "Given name(s) or first name(s) of the customer. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.",
      optional: true,
    },
    familyName: {
      type: "string",
      label: "Family Name",
      description: "Surname(s) or last name(s) of the customer. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of business identifiers used to categorize customer resources.",
      optional: true,
    },
    permissionToContact: {
      type: "boolean",
      label: "Permission to Contact",
      description: "Whether the customer has given permission to be contacted for marketing purposes.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://prod.apigateway.co";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/vnd.api+json",
      };
    },
    _makeRequest({
      $ = this,
      url,
      path,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/platform/users",
        ...args,
      });
    },
    listBusinessLocations(args = {}) {
      return this._makeRequest({
        path: "/platform/businessLocations",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/business/customers",
        ...args,
      });
    },
    listProposals(args = {}) {
      return this._makeRequest({
        path: "/platform/proposals",
        ...args,
      });
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        path: "/business/customers",
        method: "POST",
        ...args,
      });
    },
    updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        path: `/business/customers/${customerId}`,
        method: "PATCH",
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {},
    }) {
      const limit = DEFAULT_LIMIT;
      let total = 0;
      args = {
        ...args,
        params: {
          "page[limit]": limit,
        },
      };

      do {
        const {
          links, data,
        } = await resourceFn(args);
        for (const item of data) {
          yield item;
        }
        total = data?.length;
        args.url = links?.next;
      } while (total === limit);
    },
  },
};
