import common from "../common/base-polling.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "workamajig-updated-opportunity",
  name: "Updated Opportunity",
  description: "Emit new event when an opportunity is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Type",
      description: "Opportunity list type",
      options: constants.OPPORTUNITY_TYPE,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    props.range = {
      label: "Range",
    };
    if (this.type === "byLevel") {
      props.range.type = "integer";
      props.range.description = "Range for `byLevel` type";
      props.range.options = constants.BY_LEVEL_RANGE;
    }
    if (this.type === "byNeglected") {
      props.range.type = "integer";
      props.range.description = "Length of time neglected";
      props.range.options = constants.NEGLECTED_RANGE;
    }
    return props;
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.workamajig.listOpportunities;
    },
    getResourceType() {
      return "opportunity";
    },
    getParams() {
      return {
        type: this.type,
        range: this.range,
      };
    },
    getTsField() {
      return "dateUpdated";
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.dateUpdated);
      return {
        id: `${opportunity.opportunityKey}${ts}`,
        summary: `Updated Opportunity ${opportunity.opportunityKey}`,
        ts,
      };
    },
  },
  sampleEmit,
};
