import { ConfigurationError } from "@pipedream/platform";
import {
  capabilitiesToJson,
  createCashClient,
  estimateToJson,
  formatUsdc,
  orderToJson,
  prepareResultToJson,
  preparedStepToJson,
  preparedTxToJson,
  usdc,
} from "@zkp2p/cash";

const ENVIRONMENT = "production";
const DEPOSIT_ID_PATTERN = /^0x[0-9a-fA-F]{40}_\d+$/;
const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;

export default {
  type: "app",
  app: "peer_cash",
  propDefinitions: {
    platform: {
      type: "string",
      label: "Payout Platform",
      description: "The payment platform the buyer pays the fiat into (e.g. `venmo`, `revolut`, `wise`). Use **Get Payout Options** to see every platform with its currencies and payee handle format.",
      async options() {
        return this.capabilities().platforms.map(({ platform }) => platform);
      },
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The ISO 4217 fiat currency code to be paid in (e.g. `USD`, `EUR`, `GBP`). Only currencies the selected platform supports can fill.",
      async options({ platform }) {
        const capabilities = this.capabilities();
        if (!platform) {
          return capabilities.currencies;
        }
        return capabilities.platforms
          .find((entry) => entry.platform === platform)
          ?.currencies ?? [];
      },
    },
    amount: {
      type: "string",
      label: "Amount (USDC)",
      description: "The Base USDC amount to cash out, as a decimal string (e.g. `250` or `12.34`). Maximum 6 decimal places. The protocol floor is `0.01` USDC and amounts under `1` USDC rarely fill.",
    },
    depositId: {
      type: "string",
      label: "Order ID",
      description: "The Peer Cash order id in `escrowAddress_onchainId` form (e.g. `0x777777779d229cdf3110e9de47943791c26300ef_3936`). **Prepare Cash Out** returns the escrow address and the on-chain id becomes available once the deposit transaction confirms; use **List Orders** to find the id of an existing order.",
    },
    owner: {
      type: "string",
      label: "Maker Address",
      description: "The Base wallet address that owns the orders, as a `0x`-prefixed 20-byte hex string. A Peer Cash order is a deposit keyed by its depositor, so this is the address that signed the `createDeposit` transaction.",
    },
    payee: {
      type: "string",
      label: "Payee Handle",
      description: "The handle the buyer sends the fiat to on the selected platform (e.g. `@andrew-w` for Venmo, a Revtag for Revolut, an enrolled email for Zelle). Use **Get Payout Options** to read the exact format each platform expects. Peer validates the handle with the platform before returning the transactions, so a handle that does not resolve fails here rather than after funds are committed.",
    },
    referralCode: {
      type: "string",
      label: "Referral Code",
      description: "Your six-character Peer referral code from the Peer web or mobile app (e.g. `ABC123`). It is stamped on the prepared transactions as ERC-8021 attribution so fills on this order are credited to you. Omit if you do not have one.",
      optional: true,
    },
  },
  methods: {
    /**
     * The Peer Cash client. Reads need no credential; every mutating verb is
     * exposed only through its prepare path, so this client never holds or
     * requests a private key.
     *
     * @param {string} [referralCode] - Six-character Peer referral code to stamp
     * on the prepared transactions as ERC-8021 attribution.
     * @returns {object} A `CashClient` bound to the Peer production environment.
     */
    _client(referralCode) {
      return createCashClient({
        environment: ENVIRONMENT,
        ...(referralCode
          ? {
            referralCode,
          }
          : {}),
      });
    },
    /**
     * Convert a human USDC amount into 6-decimal base units.
     *
     * @param {string} amount - Decimal USDC amount, e.g. `"12.34"`.
     * @returns {bigint} The amount in USDC base units.
     */
    toBaseUnits(amount) {
      try {
        return usdc(String(amount).trim());
      } catch {
        throw new ConfigurationError(`Amount must be a positive decimal USDC value with at most 6 decimal places, e.g. \`250\` or \`12.34\`. Received \`${amount}\`.`);
      }
    },
    /**
     * Reject an order id that is not in `escrowAddress_onchainId` form before
     * it reaches the indexer.
     *
     * @param {string} depositId - The candidate order id.
     * @returns {string} The same id, once validated.
     */
    assertDepositId(depositId) {
      if (!DEPOSIT_ID_PATTERN.test(String(depositId).trim())) {
        throw new ConfigurationError(`Order ID must be \`escrowAddress_onchainId\`, e.g. \`0x777777779d229cdf3110e9de47943791c26300ef_3936\`. Received \`${depositId}\`.`);
      }
      return String(depositId).trim();
    },
    /**
     * Reject a maker address that is not a 20-byte hex address.
     *
     * @param {string} owner - The candidate maker address.
     * @returns {string} The same address, once validated.
     */
    assertAddress(owner) {
      if (!ADDRESS_PATTERN.test(String(owner).trim())) {
        throw new ConfigurationError(`Maker Address must be a \`0x\`-prefixed 20-byte hex address. Received \`${owner}\`.`);
      }
      return String(owner).trim();
    },
    /**
     * Format USDC base units back into a decimal string.
     *
     * @param {bigint|string} amount - USDC base units.
     * @returns {string} The decimal USDC amount, without trailing zeros.
     */
    fromBaseUnits(amount) {
      return formatUsdc(BigInt(amount));
    },
    /**
     * Discover payout platforms, oracle-priced currencies, the Base USDC
     * destination, payee handle hints, amount bounds, and the pricing model.
     *
     * @returns {object} The serializable capability catalog.
     */
    capabilities() {
      return capabilitiesToJson(this._client().capabilities());
    },
    /**
     * Estimate the fiat a cash-out receives at the live Chainlink oracle rate.
     *
     * @param {object} opts - Estimate inputs.
     * @param {bigint} opts.amount - Base USDC amount in base units.
     * @param {string} opts.currency - Fiat currency code.
     * @param {string} [opts.platform] - Payout platform, for pair-specific fill timing.
     * @returns {Promise<object>} The serializable oracle estimate.
     */
    async estimate({
      amount, currency, platform,
    }) {
      return estimateToJson(await this._client().estimate({
        amount,
        currency,
        ...(platform
          ? {
            platform,
          }
          : {}),
      }));
    },
    /**
     * Build the unsigned transaction plan that opens a cash-out order.
     *
     * @param {object} opts - Cash-out inputs.
     * @param {bigint} opts.amount - Base USDC amount in base units.
     * @param {object|Array} opts.receive - One payout leg, or an array of legs.
     * @param {string} [opts.referralCode] - Peer referral code for attribution.
     * @returns {Promise<object>} Unsigned transactions plus same-index step labels.
     */
    async prepare({
      amount, receive, referralCode,
    }) {
      return prepareResultToJson(await this._client(referralCode).prepare({
        amount,
        receive,
      }));
    },
    /**
     * Build the unsigned verified-buyer access-policy transaction a Venmo,
     * Cash App, or PayPal order needs once its deposit has confirmed.
     *
     * @param {string} depositId - Composite `escrowAddress_onchainId`.
     * @returns {object} One unsigned transaction.
     */
    prepareAccessPolicy(depositId) {
      return preparedTxToJson(this._client().prepareAccessPolicy(depositId));
    },
    /**
     * Read one cash-out order by its id.
     *
     * @param {string} depositId - Composite `escrowAddress_onchainId`.
     * @returns {Promise<object>} The serializable order state.
     */
    async order(depositId) {
      return orderToJson(await this._client().order(depositId));
    },
    /**
     * List the cash-out orders owned by a maker address.
     *
     * @param {string} owner - The maker wallet address.
     * @param {object} [opts] - Listing options (`inFlight`, `limit`).
     * @returns {Promise<Array>} The serializable orders, newest first.
     */
    async orders(owner, opts = {}) {
      const orders = await this._client().orders(owner, opts);
      return orders.map(orderToJson);
    },
    /**
     * Build the unsigned transaction plan that unwinds a cash-out order.
     *
     * @param {string} depositId - Composite `escrowAddress_onchainId`.
     * @param {object} [opts] - Pass `amount` for a partial withdrawal.
     * @returns {Promise<object>} Unsigned transactions plus step labels.
     */
    async prepareWithdraw(depositId, opts) {
      return this._toPlan(await this._client().prepareWithdraw(depositId, opts));
    },
    /**
     * Build the unsigned transaction plan that adds USDC to a live order.
     *
     * @param {string} depositId - Composite `escrowAddress_onchainId`.
     * @param {bigint} amount - Base USDC amount in base units.
     * @returns {Promise<object>} Unsigned transactions plus step labels.
     */
    async prepareTopUp(depositId, amount) {
      return this._toPlan(await this._client().prepareTopUp(depositId, amount));
    },
    /**
     * Describe how many unsigned transactions a prepared plan contains.
     *
     * @param {Array} txs - The prepared transactions.
     * @returns {string} A pluralized count, e.g. `"2 unsigned transactions"`.
     */
    describeTxs(txs) {
      return `${txs.length} unsigned transaction${txs.length === 1
        ? ""
        : "s"}`;
    },
    /**
     * Serialize a `{ txs, steps }` plan, encoding bigints as decimal strings.
     *
     * @param {object} plan - The prepared plan returned by the client.
     * @returns {object} The serializable plan.
     */
    _toPlan({
      txs, steps,
    }) {
      return {
        txs: txs.map(preparedTxToJson),
        steps: steps.map(preparedStepToJson),
      };
    },
  },
};
