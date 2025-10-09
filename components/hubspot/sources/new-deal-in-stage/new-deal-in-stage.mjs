import {
  API_PATH,
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_LIMIT,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

const MAX_INITIAL_EVENTS = 25;

export default {
  ...common,
  key: "hubspot-new-deal-in-stage",
  name: "New Deal In Stage",
  description: "Emit new event for each new deal in a stage.",
  version: "0.1.1",
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
    getAllStagesParams(after) {
      const filters = [
        {
          propertyName: "dealstage",
          operator: "IN",
          values: this.stages,
        },
      ];

      // Add time filter for subsequent runs to only get recently modified deals
      if (after) {
        filters.push({
          propertyName: "hs_lastmodifieddate",
          operator: "GT",
          value: after,
        });
      }

      const filterGroup = {
        filters,
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
      let initialEventsEmitted = 0;

      do {
        const results = await this.hubspot.searchCRM(params);
        if (results.paging) {
          params.after = results.paging.next.after;
        } else {
          delete params.after;
        }

        for (const deal of results.results) {
          const ts = await this.getTs(deal);
          if (!after || this.isRelevant(ts, after)) {
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
            if (!after && ++initialEventsEmitted >= MAX_INITIAL_EVENTS) {
              return;
            }
          }
        }

        // first run, get only first page
        if (!after) {
          break;
        }
      } while (params.after);
    },
    async processResults(after) {
      const params = this.getAllStagesParams(after);
      await this.processDeals(params, after);
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
