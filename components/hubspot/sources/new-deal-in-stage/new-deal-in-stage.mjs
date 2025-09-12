import {
  API_PATH,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_LIMIT,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-deal-in-stage",
  name: "New Deal In Stage",
  description: "Emit new event for each new deal in a stage.",
  version: "0.0.37",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    pipeline: {
      propDefinition: [
        common.props.hubspot,
        "dealPipeline",
      ],
    },
    stages: {
      propDefinition: [
        common.props.hubspot,
        "stages",
        (c) => ({
          pipeline: c.pipeline,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    async getTs(deal) {
      const { properties } = await this.hubspot.getDeal({
        dealId: deal.id,
        params: {
          includePropertyVersions: true,
        },
      });
      return properties.dealstage?.versions[0].timestamp;
    },
    emitEvent(deal, ts) {
      const {
        id, properties,
      } = deal;
      this.$emit(deal, {
        id: `${id}${properties.dealstage}`,
        summary: `${properties.dealname}`,
        ts,
      });
    },
    isRelevant(ts, updatedAfter) {
      return ts > updatedAfter;
    },
    getParams() {
      return null;
    },
    getStageParams(stage) {
      const filter = {
        propertyName: "dealstage",
        operator: "EQ",
        value: stage,
      };
      const filterGroup = {
        filters: [
          filter,
        ],
      };
      return {
        data: {
          limit: DEFAULT_LIMIT,
          filterGroups: [
            filterGroup,
          ],
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
          properties: DEFAULT_DEAL_PROPERTIES,
        },
        object: "deals",
      };
    },
    async processDeals(params, after) {
      let maxTs = after || 0;

      do {
        const results = await this.hubspot.searchCRM(params);
        if (results.paging) {
          params.after = results.paging.next.after;
        } else {
          delete params.after;
        }

        for (const deal of results.results) {
          const ts = await this.getTs(deal);
          if (this.isRelevant(ts, after)) {
            if (deal.properties.hubspot_owner_id) {
              deal.properties.owner = await this.getOwner(
                deal.properties.hubspot_owner_id,
              );
            }
            this.emitEvent(deal, ts);
            if (ts > maxTs) {
              maxTs = ts;
              this._setAfter(ts);
            }
          }
        }
      } while (params.after);
    },
    async processResults(after) {
      for (const stage of this.stages) {
        const params = this.getStageParams(stage);
        await this.processDeals(params, after);
      }
    },
    getOwner(ownerId) {
      return this.hubspot.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: `/owners/${ownerId}`,
      });
    },
  },
  sampleEmit,
};
