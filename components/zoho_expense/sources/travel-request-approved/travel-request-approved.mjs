import common from "../common/polling.mjs";

export default {
  ...common,
  key: "zoho_expense-travel-request-approved",
  name: "Travel Request Approved",
  description: "Activate after approval of a travel request. [See the Documentation](https://www.zoho.com/expense/api/v1/trips/#retrive-list-of-all-trips).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "trips";
    },
    getResourceFn() {
      return this.app.listTrips;
    },
    getResourceFnArgs() {
      return {
        params: {
          filter_by: "Type.Trip,Status.Approved",
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.last_modified_time);
      return {
        id: `${resource.trip_id}-${ts}`,
        summary: `Travel Approved: ${resource.trip_id}`,
        ts,
      };
    },
  },
};
