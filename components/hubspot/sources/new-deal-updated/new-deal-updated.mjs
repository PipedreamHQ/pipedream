import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal-updated",
  name: "New Deal Updated",
  description: "Emit new event each time a deal is updated. [See the docs here](https://developers.hubspot.com/docs/api/crm/search)",
  version: "0.0.16",
  type: "source",
  dedupe: "unique",
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
      return Date.parse(deal.updatedAt);
    },
    generateMeta(deal) {
      const {
        id,
        properties,
      } = deal;
      const ts = this.getTs(deal);
      return {
        id: `${id}${ts}`,
        summary: properties.dealname,
        ts,
      };
    },
    isRelevant(deal, updatedAfter) {
      return this.getTs(deal) > updatedAfter;
    },
    getParams() {
      const params = {
        limit: 100,
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
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
