import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sendcloud-return-created",
  name: "New Return Created",
  description: "Emit new event each time a return is created.",
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

    const items = getSortedItems(returns, (r) => r?.created_at);

    emitNewItems({
      items,
      checkpointKey: "returns.lastCreatedAt",
      getTs: (r) => r?.created_at,
      getId: (r) => r.id || r?.reason?.id,
      getSummary: (r) => `Return ${r.id || r?.reason?.id} created`,
    });
  },
};

