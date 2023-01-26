import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "hotspotsystem-new-subscriber-created",
  name: "New Subscriber Created",
  description: "Emit new event when a new subscriber in a location is created. [See the docs](http://www.hotspotsystem.com/apidocs/api/reference/#operation-getsubscribersbylocationid).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    listLocationSubscribers({
      locationId, ...args
    }) {
      return this.app.makeRequest({
        path: `/locations/${locationId}/subscribers`,
        ...args,
      });
    },
    getResourcesFn() {
      return this.listLocationSubscribers;
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
        summary: `New Subscriber ${resource.id}`,
        ts: Date.parse(resource.registered_at),
      };
    },
  },
};
