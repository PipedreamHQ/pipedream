import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "postmark",
  propDefinitions: {
    domainId: {
      type: "string",
      label: "Domain Id",
      description: "The identifier of the domain.",
      async options({ page }) {
        const { Domains = [] } = await this.listDomains({
          params: {
            count: LIMIT,
            offset: LIMIT * page,
          },
        });

        return Domains.map(({
          Name: label, ID: value,
        }) => {
          return {
            label,
            value,
          };
        });
      },
    },
    signatureId: {
      type: "string",
      label: "Signature Id",
      description: "The identifier of the sender signature.",
      async options({ page }) {
        const { SenderSignatures = [] } = await this.listSenderSignatures({
          params: {
            count: LIMIT,
            offset: LIMIT * page,
          },
        });

        return SenderSignatures.map(({
          Name, Domain, ID: value,
        }) => {
          return {
            label: `${Name} - ${Domain}`,
            value,
          };
        });
      },
    },
    templateAlias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      async options(context) {
        let { page } = context;
        const data = await this.listTemplates(page++);
        const options =
          data.Templates?.map((obj) => {
            return {
              label: obj.Name,
              value: obj.Alias,
            };
          }) ?? [];

        return {
          options,
          context: {
            page,
          },
        };
      },
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter by tag",
      optional: true,
    },
    fromdate: {
      type: "string",
      label: "From Date",
      description: "Filter stats starting from the date specified (inclusive). **e.g. 2014-01-01**",
      optional: true,
    },
    todate: {
      type: "string",
      label: "To Date",
      description: "Filter stats up to the date specified (inclusive). **e.g. 2014-02-01**",
      optional: true,
    },
    messagestream: {
      type: "string",
      label: "Message Stream",
      description: "Filter by message stream. If not provided, the response will include stats for all streams in the server.",
      optional: true,
    },
  },
  methods: {
    _apikey() {
      return this.$auth.api_key;
    },
    _serverApiKey() {
      return this.$auth.server_api_key;
    },
    getHeaders(tokenType = "server") {
      const obj = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      switch (tokenType) {
      case "server": obj["X-Postmark-Server-Token"] = this._serverApiKey();break;
      case "account": obj["X-Postmark-Account-Token"] = this._apikey();break;
      }

      return obj;
    },
    _makeRequest({
      $, path, tokenType, ...opts
    }) {
      return axios($, {
        url: `https://api.postmarkapp.com/${path}`,
        headers: this.getHeaders(tokenType),
        ...opts,
      });
    },
    listTemplates(page) {
      const amountPerPage = 10;
      const offset = page * amountPerPage;

      return this._makeRequest({
        path: `templates?Count=${amountPerPage}&Offset=${offset}&TemplateType=Standard`,
      });
    },
    sendSingleEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "email",
        ...opts,
      });
    },
    sendEmailWithTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "email/withTemplate",
        ...opts,
      });
    },
    createDataRemoval(opts = {}) {
      return this._makeRequest({
        method: "POST",
        tokenType: "account",
        path: "data-removals",
        ...opts,
      });
    },
    createDomain(opts = {}) {
      return this._makeRequest({
        method: "POST",
        tokenType: "account",
        path: "domains",
        ...opts,
      });
    },
    createSignature(opts = {}) {
      return this._makeRequest({
        method: "POST",
        tokenType: "account",
        path: "senders",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        ...opts,
      });
    },
    deleteDomain({
      domainId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        tokenType: "account",
        path: `domains/${domainId}`,
        ...opts,
      });
    },
    deleteSignature({
      signatureId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        tokenType: "account",
        path: `senders/${signatureId}`,
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${hookId}`,
      });
    },
    getDomain({
      domainId, ...opts
    }) {
      return this._makeRequest({
        tokenType: "account",
        path: `domains/${domainId}`,
        ...opts,
      });
    },
    getOutboundOverview(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound",
        ...opts,
      });
    },
    getSentCounts(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/sends",
        ...opts,
      });
    },
    getBounceCounts(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/bounces",
        ...opts,
      });
    },
    getSpamComplaints(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/spam",
        ...opts,
      });
    },
    getTrackedEmailCounts(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/tracked",
        ...opts,
      });
    },
    getEmailOpenCounts(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/opens",
        ...opts,
      });
    },
    getEmailPlatformUsage(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/opens/platforms",
        ...opts,
      });
    },
    getClickCounts(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/clicks",
        ...opts,
      });
    },
    getBrowserUsage(opts = {}) {
      return this._makeRequest({
        path: "stats/outbound/clicks/browserfamilies",
        ...opts,
      });
    },
    getSignature({
      signatureId, ...opts
    }) {
      return this._makeRequest({
        tokenType: "account",
        path: `senders/${signatureId}`,
        ...opts,
      });
    },
    listDomains(opts = {}) {
      return this._makeRequest({
        tokenType: "account",
        path: "domains",
        ...opts,
      });
    },
    listSenderSignatures(opts = {}) {
      return this._makeRequest({
        tokenType: "account",
        path: "senders",
        ...opts,
      });
    },
    resendConfirmation({
      signatureId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        tokenType: "account",
        path: `senders/${signatureId}/resend`,
        ...opts,
      });
    },
    rotateDKIM({
      domainId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        tokenType: "account",
        path: `domains/${domainId}/rotatedkim`,
        ...opts,
      });
    },
    updateSignature({
      signatureId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        tokenType: "account",
        path: `senders/${signatureId}`,
        ...opts,
      });
    },
    verifyDKIM({
      domainId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        tokenType: "account",
        path: `domains/${domainId}/verifyDkim`,
        ...opts,
      });
    },
    verifyReturnPath({
      domainId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        tokenType: "account",
        path: `domains/${domainId}/verifyReturnPath`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, fieldList,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.count = LIMIT;
        params.offset = LIMIT * page;
        page++;
        const response = await fn({
          params,
        });
        const data = response[fieldList];

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
