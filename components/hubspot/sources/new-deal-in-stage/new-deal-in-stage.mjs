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
  version: "0.1.14",
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
    async emitEvent(deal, ts) {
      const {
        id, properties,
      } = deal;
      if (properties.hubspot_owner_id) {
        try {
          properties.owner = await this.getOwner(properties.hubspot_owner_id);
        } catch (err) {
          properties.owner = null;
          console.warn(
            `Failed to fetch owner ${properties.hubspot_owner_id} for deal ${id}: ${err.message}`,
          );
        }
      }
      this.$emit(deal, {
        id: `${id}${properties.dealstage}`,
        summary: `${properties.dealname}`,
        ts,
      });
    },
    // Sorted by last modified, not by stage entry time, so never stop early.
    reachedCursor() {
      return false;
    },
    isRelevant(deal, updatedAfter, ts) {
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
    async processResults(after) {
      await this.paginate(
        this.getAllStagesParams(after),
        this.hubspot.searchCRM.bind(this),
        "results",
        after,
      );
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
