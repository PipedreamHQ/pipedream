import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sendcloud-parcel-status-changed",
  name: "Parcel Status Changed",
  description: "Emit new event each time a parcel status changes.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    shouldConvertDateString() {
      return true;
    },
    setLastStatusAt(value) {
      this.db.set("parcels.lastStatusAt", value);
    },
    getLastStatusAt() {
      return this.db.get("parcels.lastStatusAt");
    },
    getStatusStore() {
      return this.db.get("parcels.statusById") || {};
    },
    setStatusStore(store) {
      this.db.set("parcels.statusById", store);
    },
    getStatusLabel(parcel) {
      return parcel?.status?.message || "Status changed";
    },
  },
  async run() {
    const {
      app,
      getSortedItems,
      emitNewItems,
      getStatusStore,
      setStatusStore,
      getStatusLabel,
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

    const items = getSortedItems(parcels, (r) => r?.date_updated || r?.date_created);

    const statusStore = getStatusStore();
    const isFirstRun = !Object.keys(statusStore).length;
    const changed = items.filter((parcel) => {
      const key = String(parcel?.id);
      const hasNumericId = parcel?.status?.id !== null && parcel?.status?.id !== undefined;
      const current = hasNumericId
        ? String(parcel.status.id)
        : parcel?.status?.message;
      const prev = statusStore[key];
      statusStore[key] = current;
      return isFirstRun || (prev !== undefined && prev !== current);
    });

    if (changed.length) {
      emitNewItems({
        items: changed,
        checkpointKey: "parcels.lastStatusAt",
        getTs: (r) => r?.date_updated || r?.date_created,
        getId: (r, ts) => `${r.id}-${ts.getTime()}`,
        getSummary: (r) => {
          const label = getStatusLabel(r);
          const statusId = r?.status?.id;
          return statusId != null
            ? `Parcel ${r.id}: [${statusId}] ${label}`
            : `Parcel ${r.id}: ${label}`;
        },
      });
    }

    setStatusStore(statusStore);
  },
};

