import oanda from "../../oanda.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "oanda-create-order",
  name: "Create Order",
  description: "Create a new trading order. [See the documentation](https://developer.oanda.com/rest-live-v20/order-ep/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    oanda,
    isDemo: {
      propDefinition: [
        oanda,
        "isDemo",
      ],
    },
    accountId: {
      propDefinition: [
        oanda,
        "accountId",
        (c) => ({
          isDemo: c.isDemo,
        }),
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the order to create",
      options: constants.ORDER_TYPES,
      reloadProps: true,
    },
    tradeID: {
      propDefinition: [
        oanda,
        "tradeId",
        (c) => ({
          isDemo: c.isDemo,
          accountId: c.accountId,
        }),
      ],
      optional: true,
      hidden: true,
    },
    instrument: {
      propDefinition: [
        oanda,
        "instrument",
      ],
      description: "The instrument for the order. E.g. `AUD_USD`",
      optional: true,
      hidden: true,
    },
    units: {
      type: "integer",
      label: "Units",
      description: "The quantity requested to be filled by the Order. A positive number of units results in a long Order, and a negative number of units results in a short Order.",
      optional: true,
      hidden: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price threshold specified for the Limit Order. The Order will only be filled by a market price that is equal to or better than this price.",
      optional: true,
      hidden: true,
    },
    distance: {
      type: "string",
      label: "Distance",
      description: "Specifies the distance (in price units) from the Account’s current price to use as the Stop Loss Order price. If the Trade is short the Instrument’s bid price is used, and for long Trades the ask is used",
      optional: true,
      hidden: true,
    },
    timeInForce: {
      type: "string",
      label: "Time in Force",
      description: "The time-in-force requested for the Order. Restricted to FOK or IOC for a MarketOrder.",
      options: constants.TIME_IN_FORCE_OPTIONS,
      optional: true,
      hidden: true,
    },
    gtdTime: {
      type: "string",
      label: "GTD Time",
      description: "The date/time when the Stop Order will be cancelled if its timeInForce is \"GTD\".",
      optional: true,
      hidden: true,
    },
    priceBound: {
      type: "string",
      label: "Price Bound",
      description: "The worst price that the client is willing to have the Order filled at",
      optional: true,
      hidden: true,
    },
    positionFill: {
      type: "string",
      label: "Position Fill",
      description: "Specification of how Positions in the Account are modified when the Order is filled",
      options: constants.POSITION_FILL_OPTIONS,
      optional: true,
      hidden: true,
    },
    triggerCondition: {
      type: "string",
      label: "Trigger Condition",
      description: "Specification of which price component should be used when determining if an Order should be triggered and filled",
      options: constants.ORDER_TRIGGER_CONDITIONS,
      optional: true,
      hidden: true,
    },
  },
  additionalProps(props) {
    if (!this.type) {
      return {};
    }
    const fields = constants.REQUIRED_FIELDS_FOR_ORDER_TYPES[this.type];
    for (const [
      key,
      value,
    ] of Object.entries(fields)) {
      props[key].hidden = false;
      props[key].optional = !value;
    }
    return {};
  },
  async run({ $ }) {
    const {
      oanda,
      isDemo,
      accountId,
      type,
      ...fields
    } = this;

    const response = await oanda.createOrder({
      $,
      isDemo,
      accountId,
      data: {
        order: {
          type,
          ...fields,
        },
      },
    });
    $.export("$summary", "Successfully created order");
    return response;
  },
};
