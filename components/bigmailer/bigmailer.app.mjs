import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bigmailer",
  propDefinitions: {
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The ID of the brand",
      async options({ prevContext }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const {
          data: brands, cursor,
        } = await this.listBrands({
          params,
        });
        const options = brands.map((brand) => ({
          label: brand.name,
          value: brand.id,
        }));
        return {
          options,
          context: {
            cursor,
          },
        };
      },
    },
    listIds: {
      type: "string[]",
      label: "List ID",
      description: "The ID of the list",
      async options({
        brandId, prevContext,
      }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const {
          data: lists, cursor,
        } = await this.listLists({
          brandId,
          params,
        });
        const options = lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
        return {
          options,
          context: {
            cursor,
          },
        };
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the transactional campaign",
      async options({
        brandId, prevContext,
      }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const {
          data: campaigns, cursor,
        } = await this.listTransactionalCampaigns({
          brandId,
          params,
        });
        const options = campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
        return {
          options,
          context: {
            cursor,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      async options({
        brandId, prevContext,
      }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const {
          data: contacts, cursor,
        } = await this.listContacts({
          brandId,
          params,
        });
        const options = contacts.map((contact) => contact.email);
        return {
          options,
          context: {
            cursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bigmailer.io/v1";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "X-API-Key": `${this._apiKey()}`,
        },
      });
    },
    listBrands(args = {}) {
      return this._makeRequest({
        path: "/brands",
        ...args,
      });
    },
    listTransactionalCampaigns({
      brandId, ...args
    }) {
      return this._makeRequest({
        path: `/brands/${brandId}/transactional-campaigns`,
        ...args,
      });
    },
    listContacts({
      brandId, ...args
    }) {
      return this._makeRequest({
        path: `/brands/${brandId}/contacts`,
        ...args,
      });
    },
    listFields({
      brandId, ...args
    }) {
      return this._makeRequest({
        path: `/brands/${brandId}/fields`,
        ...args,
      });
    },
    listLists({
      brandId, ...args
    }) {
      return this._makeRequest({
        path: `/brands/${brandId}/lists`,
        ...args,
      });
    },
    sendTransactionalCampaign({
      brandId, campaignId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/brands/${brandId}/transactional-campaigns/${campaignId}/send`,
        ...args,
      });
    },
    upsertContact({
      brandId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/brands/${brandId}/contacts/upsert`,
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {},
    }) {
      args.params = {
        ...args?.params,
      };
      let lastPage = true;
      do {
        const {
          data, cursor, has_more: hasMore,
        } = await resourceFn(args);
        for (const item of data || []) {
          yield item;
        }
        lastPage = !hasMore;
        args.params.cursor = cursor;
      } while (!lastPage);
    },
  },
};
