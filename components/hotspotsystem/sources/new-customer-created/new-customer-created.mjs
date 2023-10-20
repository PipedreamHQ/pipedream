import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "hotspotsystem-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer in a location is created. [See the docs](http://www.hotspotsystem.com/apidocs/api/reference/#operation-getcustomersbylocationid).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    listLocationCustomers({
      locationId, ...args
    }) {
      return this.app.makeRequest({
        path: `/locations/${locationId}/customers`,
        ...args,
      });
    },
    getResourcesFn() {
      return this.listLocationCustomers;
    },
    getResourcesFnArgs() {
      return {
        locationId: this.locationId,
        params: {
          limit: constants.DEFAULT_LIMIT,
          sort: `-${constants.FIELDS.REGISTERED_AT}`,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Customer ${resource.id}`,
        ts: Date.parse(resource.registered_at),
      };
    },
  },
};
