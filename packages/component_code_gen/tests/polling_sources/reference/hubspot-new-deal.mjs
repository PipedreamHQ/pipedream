import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import Bottleneck from "bottleneck";

export default {
  key: "hubspot-new-deal",
  name: "New Deals",
  description: "Emit new event for each new deal created. [See the docs here](https://developers.hubspot.com/docs/api/crm/search)",
  version: "0.0.15",
  dedupe: "unique",
  type: "source",
  props: {
    hubspot: {
      type: "app",
      app: "hubspot",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    pipeline: {
      type: "string",
      label: "Pipeline",
      description: "Filter deals by pipeline",
      optional: true,
      async options() {
        const { results } = await this.getPipelines("deal");
        return results.map((result) => {
          const {
            label,
            id: value,
          } = result;
          return {
            label,
            value,
          };
        });
      },
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Filter deals by stage",
      optional: true,
      async options({ pipeline }) {
        const { results } = await this.getDealStages(pipeline);
        return results.map((result) => {
          const {
            label,
            id,
          } = result;
          return {
            label,
            value: id,
          };
        });
      },
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.hubspot.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async makeRequest(api, endpoint, opts = {}) {
      const {
        method = "GET",
        params,
        data,
        $,
      } = opts;
      const config = {
        method,
        url: `${"https://api.hubapi.com"}${api}${endpoint}`,
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    async getPipelines(objectType, $) {
      return this.makeRequest("/crm/v3", `/pipelines/${objectType}`, {
        $,
      });
    },
    async getDealStages(pipelineId, $) {
      return this.makeRequest("/crm/v3", `/pipelines/deal/${pipelineId}/stages`, {
        $,
      });
    },
    async searchCRM(params, after) {
      await this.paginate(
        params,
        this.makeRequest,
        "results",
        after,
      );
    },
    async paginate(params, resourceFn, resultType = null, after = null) {
      let results = null;
      let maxTs = after || 0;
      const limiter = this._limiter();
      while (!results || params.after) {
        results = await this._requestWithLimiter(limiter, resourceFn, params);
        if (results.paging) {
          params.after = results.paging.next.after;
        } else {
          delete params.after;
        }
        if (resultType) {
          results = results[resultType];
        }

        for (const result of results) {
          if (await this.isRelevant(result, after)) {
            this.emitEvent(result);
            const ts = this.getTs(result);
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
          } else {
            return;
          }
        }
      }
    },
    _getAfter() {
      return this.db.get("after") || new Date().setDate(new Date().getDate() - 1); // 1 day ago
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    _limiter() {
      return new Bottleneck({
        minTime: 250, // max 4 requests per second
      });
    },
    async _requestWithLimiter(limiter, resourceFn, params) {
      return limiter.schedule(async () => await resourceFn(params));
    },
    getTs(deal) {
      return Date.parse(deal.createdAt);
    },
    generateMeta(deal) {
      const {
        id,
        properties,
      } = deal;
      const ts = this.getTs(deal);
      return {
        id,
        summary: properties.dealname,
        ts,
      };
    },
    isRelevant(deal, createdAfter) {
      return this.getTs(deal) > createdAfter;
    },
    getParams() {
      const params = {
        limit: 100,
        sorts: [
          {
            propertyName: "createdate",
            direction: "DESCENDING",
          },
        ],
        object: "deals",
      };
      if (this.pipeline) {
        params.filters = [
          {
            propertyName: "pipeline",
            operator: "EQ",
            value: this.pipeline,
          },
        ];
        if (this.stage) {
          params.filters.push({
            propertyName: "dealstage",
            operator: "EQ",
            value: this.stage,
          });
        }
      }
      return params;
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
  async run() {
    const after = this._getAfter();
    const params = this.getParams(after);
    await this.processResults(after, params);
  },
};
