import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal-in-stage",
  name: "New Deal In Stage",
  description: "Emit new event for each new deal in a stage.",
  version: "0.0.9",
  dedupe: "unique",
  type: "source",
  hooks: {},
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
    generateMeta(deal) {
      const {
        id,
        properties,
        updatedAt,
      } = deal;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${properties.dealstage}`,
        summary: `${properties.dealname}`,
        ts,
      };
    },
    isRelevant(deal, updatedAfter) {
      return Date.parse(deal.updatedAt) > updatedAfter;
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
        limit: 100,
        filterGroups: [
          filterGroup,
        ],
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
            direction: "DESCENDING",
          },
        ],
        object: "deals",
      };
    },
    async processResults(after) {
      for (let stage of this.stages) {
        const params = this.getStageParams(stage);
        await this.searchCRM(params, after);
      }
    },
  },
};
