const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-deal-in-stage",
  name: "New Deal In Stage",
  description: "Emits an event for each new deal in a stage.",
  version: "0.0.2",
  dedupe: "unique",
  hooks: {},
  props: {
    ...common.props,
    stages: { propDefinition: [common.props.hubspot, "stages"] },
  },
  methods: {
    ...common.methods,
    generateMeta(deal, stage) {
      const { id, properties, updatedAt } = deal;
      const { label } = stage;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${properties.dealstage}`,
        summary: `${properties.dealname} ${label}`,
        ts,
      };
    },
    emitEvent(deal) {
      const stage = this.db.get("stage");
      const meta = this.generateMeta(deal, stage);
      this.$emit(deal, meta);
    },
    isRelevant(deal, updatedAfter) {
      return Date.parse(deal.updatedAt) > updatedAfter;
    },
  },
  async run(event) {
    const updatedAfter = this._getAfter();

    for (let stage of this.stages) {
      stage = JSON.parse(stage);
      this.db.set("stage", stage);
      const data = {
        limit: 100,
        filters: [
          {
            propertyName: "dealstage",
            operator: "EQ",
            value: stage.value,
          },
        ],
        sorts: [
          {
            propertyName: "lastmodifieddate",
            direction: "DESCENDING",
          },
        ],
        object: "deals",
      };

      await this.paginate(
        data,
        this.hubspot.searchCRM.bind(this),
        "results",
        updatedAfter
      );
    }

    this._setAfter(Date.now());
  },
};