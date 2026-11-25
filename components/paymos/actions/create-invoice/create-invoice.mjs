import paymos, { PAYMOS_NETWORKS } from "../../paymos.app.mjs";

export default {
  key: "paymos-create-invoice",
  name: "Create Invoice",
  description: "Create a new Paymos payment invoice priced in fiat (45 supported currencies) or crypto (USDT, USDC, USD1, DAI, or gold-backed XAUT). [See the documentation](https://paymos.io/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    paymos,
    projectId: {
      propDefinition: [
        paymos,
        "projectId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Exact order total as a decimal string, e.g. `49.95`.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "One of 45 supported fiat currency codes (e.g. `USD`, `EUR`) or a supported asset symbol (`USDT`, `USDC`, `USD1`, `DAI`, `XAUT`).",
    },
    externalOrderId: {
      propDefinition: [
        paymos,
        "externalOrderId",
      ],
      description: "Your unique order identifier (max 128 characters, cannot start with `wgt_`), e.g. `order-10042`. Reuse the same value when retrying the same order for idempotency per project.",
    },
    network: {
      type: "string",
      label: "Network",
      description: "Optional blockchain network to lock a crypto-denominated invoice to, e.g. `TRC20` or `ERC20`. Leave empty to let the payer choose.",
      optional: true,
      options: [
        ...PAYMOS_NETWORKS,
      ],
    },
    customerFeePercent: {
      type: "integer",
      label: "Customer Fee Percent",
      description: "Optional percentage of the processing fee passed to the payer (`0` to `100`, e.g. `50`), overriding the project default.",
      optional: true,
      min: 0,
      max: 100,
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "Optional merchant customer identifier (max 200 characters), e.g. `cust_42`, echoed back on invoice reads and list items.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paymos.createInvoice({
      $,
      projectId: this.projectId,
      amount: this.amount,
      currency: this.currency,
      externalOrderId: this.externalOrderId,
      network: this.network,
      customerFeePercent: this.customerFeePercent,
      clientId: this.clientId,
    });
    $.export("$summary", `Successfully created invoice ${response?.invoice_id ?? this.externalOrderId}`);
    return response;
  },
};
