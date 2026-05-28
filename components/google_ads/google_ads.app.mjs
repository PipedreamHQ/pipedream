import { axios } from "@pipedream/platform";
import { CORE_DATE_SEGMENTS } from "./common/constants.mjs";
import { QUERIES } from "./common/queries.mjs";
import {
  getResourceOption, sanitizeGaqlString,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "google_ads",
  propDefinitions: {
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email address of the contact to add to the customer list.",
    },
    userListId: {
      type: "string",
      label: "Customer List ID",
      description: "Select a Customer List to add the contact to, or provide a custom Customer List ID.",
      async options({
        accountId, customerClientId,
      }) {
        const response = await this.listUserLists({
          accountId,
          customerClientId,
        });
        return response?.filter(({ userList: { type } }) => type === "CRM_BASED")?.map(({
          userList: {
            id, name,
          },
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Use Google Ads As",
      description: "The ID of an account of a [customer directly accessible by the authenticated user](https://developers.google.com/google-ads/api/reference/rpc/v21/CustomerService/ListAccessibleCustomers?transport=rest). This is usually a Manager Account, used as `login-customer-id` (e.g., `1234567890`). Use the **List Account ID Options** action to get the list of accessible accounts.",
      async options() {
        const response = await this.listAccessibleCustomers();
        return response?.map(((resourceName) => ({
          label: resourceName,
          value: resourceName.split("/").pop(),
        })));
      },
    },
    customerClientId: {
      type: "string",
      label: "Managed Account",
      description: "The ID of a [customer client](https://developers.google.com/google-ads/api/reference/rpc/v21/CustomerClient) from the list of [customers linked to the selected account](https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy) (e.g., `1234567890`). Use the **List Customer Clients** action to get the list of customer clients.",
      useQuery: true,
      optional: true,
      async options({
        accountId, query,
      }) {
        const response = await this.listCustomerClients({
          accountId,
          query,
        });
        return response?.map(({
          customerClient: {
            descriptiveName, id, manager,
          },
        }) => ({
          label: `${manager
            ? "[Manager] "
            : ""}${descriptiveName}`,
          value: id,
        })).filter(({ value }) => value !== accountId);
      },
    },
    reportResourceFilter: {
      type: "string[]",
      label: "Filter by Resources",
      description: "Select the resources to generate a report for (or leave blank for all)",
      optional: true,
      useQuery: true,
      async options({
        accountId, customerClientId, resource, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listResources({
          accountId,
          customerClientId,
          resource,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => this.getResourceOption(item, resource));
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    reportOrderBy: {
      type: "string",
      label: "Order By",
      description: "The field to order the results by",
      optional: true,
      options({
        fields, segments, metrics, dateRange,
      }) {
        return [
          fields,
          segments,
          metrics,
        ].filter((v) => v).flatMap((value) => {
          let returnValue = value;
          if (typeof value === "string") {
            try {
              returnValue = JSON.parse(value);
            } catch (err) {
              returnValue = value.split(",");
            }
          }
          return returnValue?.map?.((str) => str.trim());
        })
          .filter((v) => dateRange || !CORE_DATE_SEGMENTS.includes(v));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign",
      description: "Select a campaign. Use the **List Campaigns** action to discover options. Returns a numeric campaign ID (e.g., `1234567890`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listResources({
          accountId,
          customerClientId,
          resource: "campaign",
          query,
          pageToken,
        });
        const options = results?.map?.((item) => this.getResourceOption(item, "campaign")) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    campaignSharedSetId: {
      type: "string",
      label: "Campaign Shared Set",
      description: "Select a campaign shared set to remove. Use the **List Campaign Shared Sets** action to discover options. Returns a resource name (e.g., `customers/123/campaignSharedSets/456~789`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listCampaignSharedSets({
          accountId,
          customerClientId,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => ({
          label: `${item.campaign?.name} → ${item.sharedSet?.name}`,
          value: item.campaignSharedSet?.resourceName,
        })) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    sharedCriterionId: {
      type: "string",
      label: "Shared Criterion",
      description: "Select a shared criterion to remove. Use the **List Shared Criteria** action to discover options. Returns a resource name (e.g., `customers/123/sharedCriteria/456~789`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listSharedCriteria({
          accountId,
          customerClientId,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => {
          const criterion = item.sharedCriterion;
          const sharedSetName = item.sharedSet?.name;
          let criterionLabel;
          if (criterion?.type === "KEYWORD") {
            criterionLabel = `[${criterion.keyword?.matchType}] ${criterion.keyword?.text}`;
          } else {
            criterionLabel = `[${criterion?.type}] ${criterion?.criterionId}`;
          }
          return {
            label: `${criterionLabel} (${sharedSetName})`,
            value: criterion?.resourceName,
          };
        }) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    sharedSetId: {
      type: "string",
      label: "Shared Set",
      description: "Select a shared set. Use the **List Shared Sets** action to discover options. Returns a numeric shared set ID (e.g., `1234567890`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listAllSharedSets({
          accountId,
          customerClientId,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => ({
          label: `[${item.sharedSet?.type}] ${item.sharedSet?.name}`,
          value: item.sharedSet?.id,
        })) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    adGroupCriterionId: {
      type: "string",
      label: "Keyword",
      description: "Select a keyword criterion to update or remove. Use the **List Keywords** action to discover options.",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listKeywords({
          accountId,
          customerClientId,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => ({
          label: `[${item.adGroupCriterion?.keyword?.matchType}] ${item.adGroupCriterion?.keyword?.text}`,
          value: item.adGroupCriterion?.resourceName,
        })) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    adGroupAdId: {
      type: "string",
      label: "Ad Group Ad",
      description: "Select an ad within an ad group. Use the **List Ad Group Ads** action to discover options. Returns a resource name (e.g., `customers/123/adGroupAds/456~789`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listResources({
          accountId,
          customerClientId,
          resource: "ad_group_ad",
          query,
          pageToken,
        });
        const options = results?.map?.((item) => ({
          label: item.adGroupAd?.ad?.name ?? `Ad ${item.adGroupAd?.ad?.id}`,
          value: item.adGroupAd?.resourceName,
        })) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    adGroupId: {
      type: "string",
      label: "Ad Group",
      description: "Select an ad group. Use the **List Ad Groups** action to discover options.",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listResources({
          accountId,
          customerClientId,
          resource: "ad_group",
          query,
          pageToken,
        });
        const options = results?.map?.((item) => this.getResourceOption(item, "ad_group")) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    campaignBudgetId: {
      type: "string",
      label: "Campaign Budget",
      description: "Select a campaign budget. Use the **List Campaign Budgets** action to discover options. Returns a numeric budget ID (e.g., `1234567890`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listAllCampaignBudgets({
          accountId,
          customerClientId,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => ({
          label: item.campaignBudget?.name ?? `Budget ${item.campaignBudget?.id}`,
          value: item.campaignBudget?.id,
        })) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    campaignCriterionId: {
      type: "string",
      label: "Campaign Criterion",
      description: "Select a campaign criterion to remove. Use the **List Campaign Criteria** action to discover options. Returns a resource name (e.g., `customers/123/campaignCriteria/456~789`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listCampaignCriteria({
          accountId,
          customerClientId,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => {
          const criterion = item.campaignCriterion;
          const campaignName = item.campaign?.name;
          let criterionLabel;
          if (criterion?.type === "KEYWORD") {
            criterionLabel = `[${criterion.keyword?.matchType}] ${criterion.keyword?.text}`;
          } else {
            criterionLabel = `[${criterion?.type}] ${criterion?.criterionId}`;
          }
          return {
            label: `${criterionLabel} (${campaignName})`,
            value: criterion?.resourceName,
          };
        }) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    biddingStrategyId: {
      type: "string",
      label: "Bidding Strategy",
      description: "Select a bidding strategy. Use the **List Bidding Strategies** action to discover options. Returns a numeric bidding strategy ID (e.g., `1234567890`).",
      useQuery: true,
      async options({
        accountId, customerClientId, query, prevContext,
      }) {
        const pageToken = prevContext?.nextPageToken;
        const {
          results, nextPageToken,
        } = await this.listAllBiddingStrategies({
          accountId,
          customerClientId,
          query,
          pageToken,
        });
        const options = results?.map?.((item) => ({
          label: `[${item.biddingStrategy?.type}] ${item.biddingStrategy?.name}`,
          value: item.biddingStrategy?.id,
        })) ?? [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    leadFormId: {
      type: "string",
      label: "Lead Form ID",
      description: "Select a [Lead Form](https://developers.google.com/google-ads/api/reference/rpc/v21/LeadFormAsset) to watch for new entries.",
      async options({
        accountId, customerClientId,
      }) {
        const response = await this.listLeadForms({
          accountId,
          customerClientId,
        });
        return response?.map(({
          asset: {
            id, leadFormAsset: {
              businessName, headline,
            },
          },
        }) => ({
          label: `${businessName} - ${headline}`,
          value: id,
        }));
      },
    },
  },
  methods: {
    getResourceOption,
    _baseUrl() {
      return "https://googleads.m.pipedream.net";
    },
    _headers(accountId) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "login-customer-id": accountId,
      };
    },
    _makeRequest({
      $ = this, accountId, customerClientId, path, ...opts
    }) {
      const data = {
        headers: this._headers(accountId),
        path: path.replace("{customerClientId}", customerClientId ?? accountId),
        ...opts,
      };
      return axios($, {
        method: "post",
        url: this._baseUrl(),
        data,
      });
    },
    async search({
      query, ...args
    }) {
      console.log("Executing query: ", query);
      const response = await this._makeRequest({
        path: "/v21/customers/{customerClientId}/googleAds:search",
        method: "post",
        data: {
          query,
        },
        ...args,
      });
      return response;
    },
    async listAccessibleCustomers() {
      const response = await this._makeRequest({
        path: "/v21/customers:listAccessibleCustomers",
      });
      return response.resourceNames;
    },
    async listCustomerClients({
      query, ...args
    }) {
      const { results } = await this.search({
        query: QUERIES.listCustomerClients(query),
        ...args,
      });
      return results;
    },
    async createReport(args) {
      const { results } = await this.search(args);
      return results;
    },
    async createUserList(args) {
      const response = await this._makeRequest({
        path: "/v21/customers/{customerClientId}/userLists:mutate",
        method: "post",
        ...args,
      });
      return response;
    },
    async listUserLists(args) {
      const { results } = await this.search({
        query: QUERIES.listUserLists(),
        ...args,
      });
      return results;
    },
    async listConversionActions(args) {
      const { results } = await this.search({
        query: QUERIES.listConversionActions(),
        ...args,
      });
      return results;
    },
    async listRemarketingActions(args) {
      const { results } = await this.search({
        query: QUERIES.listRemarketingActions(),
        ...args,
      });
      return results;
    },
    async listLeadForms(args) {
      const { results } = await this.search({
        query: QUERIES.listLeadForms(),
        ...args,
      });
      return results;
    },
    async listCampaigns({
      query, ...args
    }) {
      const { results } = await this.search({
        query: QUERIES.listCampaigns(query),
        ...args,
      });
      return results;
    },
    async listResources({
      resource, query, pageToken, ...args
    }) {
      return this.search({
        query: QUERIES.listResources(resource, query),
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async getLeadFormData({
      leadFormId, ...args
    }) {
      const { results } = await this.search({
        query: QUERIES.listLeadFormSubmissionData(leadFormId),
        ...args,
      });
      return results;
    },
    async createConversionAction(args) {
      const response = await this._makeRequest({
        path: "/v21/customers/{customerClientId}/conversionActions:mutate",
        method: "post",
        ...args,
      });
      return response;
    },
    async addContactToCustomerList({
      path, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v21/${path}:addOperations`,
        ...opts,
      });
    },
    async createOfflineUserDataJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/offlineUserDataJobs:create",
        ...opts,
      });
    },
    async runOfflineUserDataJob({
      path, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v21/${path}:run`,
        ...args,
      });
    },
    async generateKeywordIdeas(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v22/customers/{customerClientId}:generateKeywordIdeas",
        ...opts,
      });
    },
    async mutateCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/campaigns:mutate",
        ...opts,
      });
    },
    async mutateAdGroup(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/adGroups:mutate",
        ...opts,
      });
    },
    async listAllCampaigns({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` WHERE campaign.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, campaign.start_date, campaign.end_date FROM campaign${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async listAllAdGroups({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` WHERE ad_group.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT ad_group.id, ad_group.name, ad_group.status, ad_group.campaign, ad_group.type FROM ad_group${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async listAllAdGroupAds({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` WHERE ad_group_ad.ad.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT ad_group_ad.resource_name, ad_group_ad.ad.id, ad_group_ad.ad.name, ad_group_ad.ad.type, ad_group_ad.status, ad_group.id, ad_group.name FROM ad_group_ad${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async listAllKeywords({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND ad_group_criterion.keyword.text LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT ad_group_criterion.criterion_id, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.cpc_bid_micros, ad_group_criterion.negative, ad_group.id, ad_group.name FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async listKeywords({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND ad_group_criterion.keyword.text LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async mutateAdGroupCriteria(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/adGroupCriteria:mutate",
        ...opts,
      });
    },
    async mutateAdGroupAd(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/adGroupAds:mutate",
        ...opts,
      });
    },
    async listAllSharedSets({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND shared_set.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT shared_set.id, shared_set.name, shared_set.type, shared_set.status FROM shared_set WHERE shared_set.status = 'ENABLED'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async mutateSharedSets(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/sharedSets:mutate",
        ...opts,
      });
    },
    async listSharedCriteria({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND shared_criterion.keyword.text LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT shared_criterion.resource_name, shared_criterion.criterion_id, shared_criterion.type, shared_criterion.keyword.text, shared_criterion.keyword.match_type, shared_set.id, shared_set.name FROM shared_criterion WHERE shared_criterion.type = 'KEYWORD'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async mutateSharedCriteria(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/sharedCriteria:mutate",
        ...opts,
      });
    },
    async listCampaignSharedSets({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND (campaign.name LIKE '%${sanitizeGaqlString(query)}%' OR shared_set.name LIKE '%${sanitizeGaqlString(query)}%')`
        : "";
      return this.search({
        query: `SELECT campaign_shared_set.resource_name, campaign_shared_set.status, campaign.id, campaign.name, shared_set.id, shared_set.name FROM campaign_shared_set WHERE campaign_shared_set.status = 'ENABLED'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async mutateCampaignSharedSets(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/campaignSharedSets:mutate",
        ...opts,
      });
    },
    async listAllSharedCriteria({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` WHERE shared_set.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT shared_criterion.resource_name, shared_criterion.criterion_id, shared_criterion.type, shared_criterion.keyword.text, shared_criterion.keyword.match_type, shared_set.id, shared_set.name FROM shared_criterion${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async listAllAdGroupCriteria({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` WHERE ad_group.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT ad_group_criterion.criterion_id, ad_group_criterion.resource_name, ad_group_criterion.type, ad_group_criterion.status, ad_group_criterion.negative, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.cpc_bid_micros, ad_group.id, ad_group.name FROM ad_group_criterion${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async listAllCampaignBudgets({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND campaign_budget.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT campaign_budget.id, campaign_budget.name, campaign_budget.amount_micros, campaign_budget.delivery_method, campaign_budget.period, campaign_budget.status FROM campaign_budget WHERE campaign_budget.status = 'ENABLED'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async mutateCampaignBudgets(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/campaignBudgets:mutate",
        ...opts,
      });
    },
    async listCampaignCriteria({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND campaign.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT campaign_criterion.resource_name, campaign_criterion.criterion_id, campaign_criterion.type, campaign_criterion.status, campaign_criterion.negative, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type, campaign.id, campaign.name FROM campaign_criterion WHERE campaign_criterion.type = 'KEYWORD'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async mutateCampaignCriteria(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/campaignCriteria:mutate",
        ...opts,
      });
    },
    async listAllCampaignCriteria({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` WHERE campaign.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT campaign_criterion.resource_name, campaign_criterion.criterion_id, campaign_criterion.type, campaign_criterion.status, campaign_criterion.negative, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type, campaign.id, campaign.name FROM campaign_criterion${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async listAllBiddingStrategies({
      query, pageToken, ...args
    }) {
      const filter = query
        ? ` AND bidding_strategy.name LIKE '%${sanitizeGaqlString(query)}%'`
        : "";
      return this.search({
        query: `SELECT bidding_strategy.id, bidding_strategy.name, bidding_strategy.type, bidding_strategy.status FROM bidding_strategy WHERE bidding_strategy.status = 'ENABLED'${filter}`,
        params: {
          pageToken,
        },
        ...args,
      });
    },
    async mutateBiddingStrategies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v21/customers/{customerClientId}/biddingStrategies:mutate",
        ...opts,
      });
    },
    async listKeywordQualityScores({
      campaignId, adGroupId, dateRange, ...args
    }) {
      const conditions = [
        `segments.date DURING ${dateRange ?? "LAST_30_DAYS"}`,
      ];
      if (campaignId) conditions.push(`campaign.id = ${Number(campaignId)}`);
      if (adGroupId) conditions.push(`ad_group.id = ${Number(adGroupId)}`);
      return this.search({
        query: `SELECT keyword_view.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.quality_info.quality_score, ad_group_criterion.quality_info.creative_quality_score, ad_group_criterion.quality_info.post_click_quality_score, ad_group_criterion.quality_info.search_predicted_ctr, metrics.historical_quality_score, metrics.historical_creative_quality_score, metrics.historical_landing_page_quality_score, metrics.historical_search_predicted_ctr, ad_group.id, ad_group.name, campaign.id, campaign.name FROM keyword_view WHERE ${conditions.join(" AND ")}`,
        ...args,
      });
    },
  },
};
