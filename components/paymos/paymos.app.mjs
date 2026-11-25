import {
  canonicalizeQuery,
  encodePathSegment,
  signRequest,
} from "./common/signing.mjs";
import {
  PAYMOS_DEFAULT_BASE_URL,
  PaymosApiError,
  normalizeBaseUrl,
  parseNonNegativeInteger,
  parseProblemDetails,
  requireNonEmptyString,
  validatePaymosAuth,
} from "./common/utils.mjs";

export {
  PAYMOS_DEFAULT_BASE_URL,
  PaymosApiError,
  normalizeBaseUrl,
  parseProblemDetails,
  validatePaymosAuth,
};

export const PAYMOS_PIPEDREAM_USER_AGENT = "paymos-pipedream/0.0.1";

export const PAYMOS_NETWORKS = Object.freeze([
  "ARBITRUM",
  "AVAX",
  "BASE",
  "BEP20",
  "ERC20",
  "NEAR",
  "OPTIMISM",
  "PLASMA",
  "POLYGON",
  "SOL",
  "SUI",
  "TON",
  "TRC20",
]);

export const PAYMOS_INVOICE_STATUSES = Object.freeze([
  "awaiting_client",
  "awaiting_payment",
  "confirming",
  "underpaid_waiting",
  "paid",
  "paid_over",
  "underpaid",
  "expired",
  "cancelled",
]);

export const PAYMOS_SANDBOX_STAGES = Object.freeze([
  "paid",
  "overpaid",
  "underpay",
  "cancel",
]);

export const PAYMOS_REFUND_MODES = Object.freeze([
  "full",
  "overpayment",
]);

async function loadPlatformAxios() {
  const mod = await import("@pipedream/platform");
  return mod.axios;
}

export default {
  type: "app",
  app: "paymos",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Prefixed Paymos project identifier, e.g. `prj_01J9SAMPLEPROJECT`. Find it in Paymos Dashboard -> Projects -> Details.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Prefixed Paymos invoice identifier, e.g. `inv_74BPZFhr9qy9Uz2fbRkdJX`. Returned as `invoice_id` by **Create Invoice** or **List Invoices**.",
    },
    channelId: {
      type: "string",
      label: "Payment Channel ID",
      description: "Prefixed Paymos payment channel identifier, e.g. `pch_01J9SAMPLECHANNEL`. Returned as `channel_id` by **Create Payment Channel**.",
    },
    externalOrderId: {
      type: "string",
      label: "External Order ID",
      description: "Your unique merchant order or idempotency identifier (max 128 characters, cannot start with `wgt_`), e.g. `order-10042`.",
    },
  },
  methods: {
    validateCredentials() {
      return validatePaymosAuth(this.$auth);
    },

    async testConnection({
      $ = this,
      fetchImpl,
      axiosImpl,
    } = {}) {
      return this.makeRequest({
        $,
        method: "GET",
        path: "/v1/invoices",
        query: {
          limit: 1,
        },
        fetchImpl,
        axiosImpl,
      });
    },

    async makeRequest({
      $ = this,
      method = "GET",
      path,
      query,
      body,
      requireSandbox = false,
      fetchImpl,
      axiosImpl,
      timestamp,
    }) {
      const creds = this.validateCredentials();
      const upperMethod = String(method || "GET").toUpperCase();

      if (
        (requireSandbox || String(path).startsWith("/v1/sandbox/")) &&
        creds.environment !== "sandbox"
      ) {
        throw new Error(
          "Sandbox simulation operations require a Sandbox Payment API key (pk_test_). Production keys (pk_live_) cannot call /v1/sandbox/* endpoints.",
        );
      }

      const queryString = typeof query === "string"
        ? query
        : query !== undefined
          ? canonicalizeQuery(query)
          : "";
      const bodyString = body === undefined || body === null
        ? ""
        : typeof body === "string"
          ? body
          : JSON.stringify(body);
      const url = `${creds.baseUrl}${path}${queryString}`;

      const signed = signRequest({
        method: upperMethod,
        path,
        query: queryString,
        body: bodyString,
        publicKey: creds.publicKey,
        secretKey: creds.secretKey,
        timestamp,
      });

      const headers = {
        Authorization: signed.Authorization,
        "X-Request-Timestamp": signed["X-Request-Timestamp"],
        Accept: "application/json",
        "User-Agent": PAYMOS_PIPEDREAM_USER_AGENT,
      };
      if (bodyString !== "") {
        headers["Content-Type"] = "application/json";
      }

      const fetcher = fetchImpl ?? this._fetchImpl;
      let status;
      let responseText;

      if (typeof fetcher === "function") {
        const requestInit = {
          method: upperMethod,
          headers,
        };
        if (bodyString !== "") {
          requestInit.body = bodyString;
        }
        const response = await fetcher(url, requestInit);
        status = response.status;
        responseText = await response.text();
      } else {
        const platformAxios = axiosImpl ?? this._axiosImpl ?? await loadPlatformAxios();
        const axiosConfig = {
          method: upperMethod,
          url,
          headers,
          validateStatus: () => true,
          transformResponse: [(data) => data],
          returnFullResponse: true,
        };
        if (bodyString !== "") {
          axiosConfig.data = bodyString;
        }
        const response = await platformAxios($, axiosConfig);
        status = response.status;
        responseText = typeof response.data === "string"
          ? response.data
          : response.data !== undefined && response.data !== null
            ? JSON.stringify(response.data)
            : "";
      }

      if (status < 200 || status >= 300) {
        throw new PaymosApiError(status, responseText);
      }

      if (responseText.trim() === "") {
        return {};
      }

      try {
        return JSON.parse(responseText);
      } catch (error) {
        throw new Error("Paymos API returned invalid JSON.", { cause: error });
      }
    },

    async createInvoice({
      $ = this,
      projectId,
      amount,
      currency,
      externalOrderId,
      network,
      customerFeePercent,
      clientId,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const normalizedProjectId = requireNonEmptyString(projectId, "project_id");
      const normalizedAmount = requireNonEmptyString(amount, "amount");
      const normalizedCurrency = requireNonEmptyString(currency, "currency");
      const normalizedExternalOrderId = requireNonEmptyString(externalOrderId, "external_order_id");

      if (normalizedExternalOrderId.startsWith("wgt_")) {
        throw new Error("external_order_id cannot start with the reserved prefix 'wgt_'.");
      }
      if (normalizedExternalOrderId.length > 128) {
        throw new Error("external_order_id must not exceed 128 characters.");
      }

      const body = {
        project_id: normalizedProjectId,
        amount: normalizedAmount,
        currency: normalizedCurrency,
        external_order_id: normalizedExternalOrderId,
      };

      if (typeof network === "string" && network.trim() !== "") {
        body.network = network.trim();
      }
      if (customerFeePercent !== undefined && customerFeePercent !== null && customerFeePercent !== "") {
        const feePct = Number(customerFeePercent);
        if (!Number.isInteger(feePct) || feePct < 0 || feePct > 100) {
          throw new Error("customer_fee_percent must be an integer between 0 and 100.");
        }
        body.customer_fee_percent = feePct;
      }
      if (typeof clientId === "string" && clientId.trim() !== "") {
        const normalizedClientId = clientId.trim();
        if (normalizedClientId.length > 200) {
          throw new Error("client_id must not exceed 200 characters.");
        }
        body.client_id = normalizedClientId;
      }

      return this.makeRequest({
        $,
        method: "POST",
        path: "/v1/invoices",
        body,
        fetchImpl,
        axiosImpl,
      });
    },

    async getInvoice({
      $ = this,
      invoiceId,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const normalizedInvoiceId = requireNonEmptyString(invoiceId, "invoice_id");
      return this.makeRequest({
        $,
        method: "GET",
        path: `/v1/invoices/${encodePathSegment(normalizedInvoiceId)}`,
        fetchImpl,
        axiosImpl,
      });
    },

    async listInvoices({
      $ = this,
      projectId,
      status,
      externalOrderId,
      createdFrom,
      createdTo,
      limit,
      cursor,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const query = {};

      if (typeof projectId === "string" && projectId.trim() !== "") {
        query.project_id = projectId.trim();
      }
      if (Array.isArray(status)) {
        const statuses = status
          .filter((item) => typeof item === "string" && item.trim() !== "")
          .map((item) => item.trim());
        if (statuses.length > 0) {
          query.status = statuses;
        }
      } else if (typeof status === "string" && status.trim() !== "") {
        query.status = [status.trim()];
      }
      if (typeof externalOrderId === "string" && externalOrderId.trim() !== "") {
        query.external_order_id = externalOrderId.trim();
      }
      if (createdFrom !== undefined && createdFrom !== null && createdFrom !== "") {
        query.created_from = parseNonNegativeInteger(createdFrom, "created_from");
      }
      if (createdTo !== undefined && createdTo !== null && createdTo !== "") {
        query.created_to = parseNonNegativeInteger(createdTo, "created_to");
      }
      if (limit !== undefined && limit !== null && limit !== "") {
        const parsedLimit = Number(limit);
        if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          throw new Error("limit must be an integer between 1 and 100.");
        }
        query.limit = parsedLimit;
      }
      if (typeof cursor === "string" && cursor.trim() !== "") {
        query.cursor = cursor.trim();
      }

      return this.makeRequest({
        $,
        method: "GET",
        path: "/v1/invoices",
        query,
        fetchImpl,
        axiosImpl,
      });
    },

    async cancelInvoice({
      $ = this,
      invoiceId,
      reason,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const normalizedInvoiceId = requireNonEmptyString(invoiceId, "invoice_id");
      const normalizedReason = requireNonEmptyString(reason, "reason");
      if (normalizedReason.length > 500) {
        throw new Error("reason must not exceed 500 characters.");
      }

      return this.makeRequest({
        $,
        method: "POST",
        path: `/v1/invoices/${encodePathSegment(normalizedInvoiceId)}/cancel`,
        body: {
          reason: normalizedReason,
        },
        fetchImpl,
        axiosImpl,
      });
    },

    async simulateSandboxInvoice({
      $ = this,
      invoiceId,
      stage,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const normalizedInvoiceId = requireNonEmptyString(invoiceId, "invoice_id");
      const normalizedStage = requireNonEmptyString(stage, "stage");
      if (!PAYMOS_SANDBOX_STAGES.includes(normalizedStage)) {
        throw new Error(
          `stage must be one of: ${PAYMOS_SANDBOX_STAGES.join(", ")}.`,
        );
      }

      return this.makeRequest({
        $,
        method: "POST",
        path: `/v1/sandbox/invoices/${encodePathSegment(normalizedInvoiceId)}/simulate-payment`,
        body: {
          stage: normalizedStage,
        },
        requireSandbox: true,
        fetchImpl,
        axiosImpl,
      });
    },

    async createPaymentChannel({
      $ = this,
      projectId,
      externalId,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const normalizedProjectId = requireNonEmptyString(projectId, "project_id");
      const normalizedExternalId = requireNonEmptyString(externalId, "external_id");
      if (normalizedExternalId.length > 128) {
        throw new Error("external_id must not exceed 128 characters.");
      }

      return this.makeRequest({
        $,
        method: "POST",
        path: "/v1/payment-channels",
        body: {
          project_id: normalizedProjectId,
          external_id: normalizedExternalId,
        },
        fetchImpl,
        axiosImpl,
      });
    },

    async getPaymentChannel({
      $ = this,
      channelId,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const normalizedChannelId = requireNonEmptyString(channelId, "channel_id");
      return this.makeRequest({
        $,
        method: "GET",
        path: `/v1/payment-channels/${encodePathSegment(normalizedChannelId)}`,
        fetchImpl,
        axiosImpl,
      });
    },

    async createRefund({
      $ = this,
      invoiceId,
      mode,
      externalOrderId,
      fetchImpl,
      axiosImpl,
    } = {}) {
      const normalizedInvoiceId = requireNonEmptyString(invoiceId, "invoice_id");
      const normalizedMode = requireNonEmptyString(mode, "mode");
      if (!PAYMOS_REFUND_MODES.includes(normalizedMode)) {
        throw new Error(
          `mode must be one of: ${PAYMOS_REFUND_MODES.join(", ")}.`,
        );
      }
      const normalizedExternalOrderId = requireNonEmptyString(externalOrderId, "external_order_id");

      const body = {
        invoice_id: normalizedInvoiceId,
        mode: normalizedMode,
        external_order_id: normalizedExternalOrderId,
      };

      return this.makeRequest({
        $,
        method: "POST",
        path: "/v1/refunds",
        body,
        fetchImpl,
        axiosImpl,
      });
    },
  },
};
