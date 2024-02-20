import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal",
  name: "New Deals",
  description: "Emit new event for each new deal created. [See the documentation](https://developers.hubspot.com/docs/api/crm/search)",
  version: "0.0.17",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
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
  },
  hooks: {},
  methods: {
    ...common.methods,
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
};
