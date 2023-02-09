import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal-in-stage",
  name: "New Deal In Stage",
  description: "Emit new event for each new deal in a stage.",
  version: "0.0.11",
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
    getTs(deal) {
      return Date.parse(deal.updatedAt);
    },
    generateMeta(deal) {
      const {
        id,
        properties,
      } = deal;
      const ts = this.getTs(deal);
      return {
        id: `${id}${properties.dealstage}`,
        summary: `${properties.dealname}`,
        ts,
      };
    },
    async isRelevant(deal, updatedAfter) {
      const { properties } = await this.hubspot.getDeal({
        dealId: deal.id,
        params: {
          includePropertyVersions: true,
        },
      });
      return properties.dealstage?.versions[0].timestamp > updatedAfter;
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
