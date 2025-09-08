import {
  DEFAULT_DEAL_PROPERTIES,
  DEFAULT_LIMIT,
} from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-deal",
  name: "New or Updated Deal",
  description: "Emit new event for each new or updated deal in Hubspot",
  version: "0.0.14",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_DEAL_PROPERTIES.join(", ")}\``,
    },
    properties: {
      propDefinition: [
        common.props.hubspot,
        "dealProperties",
        () => ({
          excludeDefaultProperties: true,
        }),
      ],
      label: "Additional properties to retrieve",
    },
    pipeline: {
      propDefinition: [
        common.props.hubspot,
        "dealPipeline",
      ],
      description: "Filter deals by pipeline",
      optional: true,
    },
    stage: {
      propDefinition: [
        common.props.hubspot,
        "stages",
        (c) => ({
          pipeline: c.pipeline,
        }),
      ],
      type: "string",
      label: "Stage",
      description: "Filter deals by stage",
      optional: true,
    },
    newOnly: {
      type: "boolean",
      label: "New Only",
      description: "Emit events only for new deals",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(deal) {
      return this.newOnly
        ? Date.parse(deal.createdAt)
        : Date.parse(deal.updatedAt);
    },
    generateMeta(deal) {
      const {
        id,
        properties,
      } = deal;
      const ts = this.getTs(deal);
      return {
        id: this.newOnly
          ? id
          : `${id}-${ts}`,
        summary: properties.dealname,
        ts,
      };
    },
    isRelevant(deal, updatedAfter) {
      return this.getTs(deal) > updatedAfter;
    },
    getParams() {
      const { properties = [] } = this;
      const params = {
        data: {
          limit: DEFAULT_LIMIT,
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
          properties: [
            ...DEFAULT_DEAL_PROPERTIES,
            ...properties,
          ],
        },
        object: "deals",
      };
      if (this.pipeline) {
        params.data.filters = [
          {
            propertyName: "pipeline",
            operator: "EQ",
            value: this.pipeline,
          },
        ];
        if (this.stage) {
          params.data.filters.push({
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
  sampleEmit,
};
