import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sendcloud-return-updated",
  name: "Return Updated",
  description: "Emit new event each time a return is updated.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    fromDate: {
      propDefinition: [
        common.props.app,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        common.props.app,
        "toDate",
      ],
    },
  },
  async run() {
    const {
      app,
      getSortedItems,
      emitNewItems,
      fromDate,
      toDate,
    } = this;

    const returns = await app.paginate({
      requester: app.listReturns,
      requesterArgs: {
        debug: true,
        params: {
          from_date: fromDate,
          to_date: toDate,
        },
      },
      resultsKey: "data",
      maxRequests: 5,
    });

    if (!returns?.length) {
      return;
    }

    const items = getSortedItems(returns, (r) => r?.updated_at || r?.created_at);

    emitNewItems({
      items,
      checkpointKey: "returns.lastUpdatedAt",
      getTs: (r) => r?.updated_at || r?.created_at,
      getId: (r, ts) => `${r.id || r?.reason?.id}-${ts.getTime()}`,
      getSummary: (r) => `Return ${r.id || r?.reason?.id} updated`,
    });
  },
};

