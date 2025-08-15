import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sendcloud-parcel-created",
  name: "New Parcel Created",
  description: "Emit new event each time a parcel is created.",
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

    const items = getSortedItems(parcels, (r) => r?.date_created);

    emitNewItems({
      items,
      checkpointKey: "parcels.lastCreatedAt",
      getTs: (r) => r?.date_created,
      getId: (r) => r.id,
      getSummary: (r) => `Parcel ${r.id} created`,
    });
  },
};

