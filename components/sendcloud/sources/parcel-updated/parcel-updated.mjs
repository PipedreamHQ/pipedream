import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sendcloud-parcel-updated",
  name: "Parcel Updated",
  description: "Emit new event each time a parcel is updated.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    shouldConvertDateString() {
      return true;
    },
  },
  async run() {
    const {
      app,
      getSortedItems,
      emitNewItems,
    } = this;

    const parcels = await app.paginate({
      requester: app.listParcels,
      requesterArgs: {
        debug: true,
      },
      resultsKey: "parcels",
      maxRequests: 5,
    });

    if (!parcels?.length) {
      return;
    }

    const items = getSortedItems(parcels, (r) => r?.date_updated);

    emitNewItems({
      items,
      checkpointKey: "parcels.lastUpdatedAt",
      getTs: (r) => r?.date_updated,
      getId: (r, ts) => `${r.id}-${ts.getTime()}`,
      getSummary: (r) => `Parcel ${r.id} updated`,
    });
  },
};

