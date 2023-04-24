import common from "../common/attribute-based.mjs";

export default {
  ...common,
  key: "recreation_gov-campsite-availability-changed",
  name: "New Campsite Availability Changed Event",
  description: "Emit new events when selected campsite's availability is changed. [See the documentation](https://ridb.recreation.gov/docs#/Campsites/getCampsite)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campsiteId: {
      propDefinition: [
        common.props.app,
        "campsiteId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFnConfig() {
      return {
        resourceFn: this.app.getCampsite,
        resourceKey: "RECDATA",
        params: {
          campsiteId: this.campsiteId,
        },
      };
    },
    getMeta(item) {
      return {
        ts: new Date().getTime(),
        id: new Date().getTime(),
        // eslint-disable-next-line multiline-ternary
        summary: `Campsite(${item.CampsiteName}) availability was changed to ${item.CampsiteAccessible ? "available" : "not available"}`,
      };
    },
    compareFn(item) {
      return item.CampsiteAccessible !== this.getAttribute();
    },
    getAttributeKey() {
      return "CampsiteAccessible";
    },
  },
};
