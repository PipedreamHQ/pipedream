import {
  canonicalizeQuery,
  encodePathSegment,
  signRequest,
} from "./common/signing.mjs";

export const PAYMOS_DEFAULT_BASE_URL = "https://api.paymos.io";
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

export function parseProblemDetails(rawBody) {
  if (rawBody === undefined || rawBody === null) {
    return null;
  }
  if (typeof rawBody === "object" && !Array.isArray(rawBody)) {
    return rawBody;
  }
  if (typeof rawBody !== "string" || rawBody.trim() === "") {
    return null;
  }
  try {
    const parsed = JSON.parse(rawBody);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export class PaymosApiError extends Error {
  constructor(status, responseBody) {
    const rawText = typeof responseBody === "string"
      ? responseBody
      : responseBody !== undefined && responseBody !== null
        ? JSON.stringify(responseBody)
        : "";
    const problem = parseProblemDetails(rawText);
    const detail = (typeof problem?.detail === "string" && problem.detail !== "")
      ? problem.detail
      : (typeof problem?.code === "string" && problem.code !== "")
        ? problem.code
        : (typeof problem?.title === "string" && problem.title !== "")
          ? problem.title
          : rawText || "Empty response";

    super(`Paymos API ${status}: ${detail}`);
    this.name = "PaymosApiError";
    this.status = status;
    this.type = typeof problem?.type === "string" ? problem.type : null;
    this.title = typeof problem?.title === "string" ? problem.title : null;
    this.code = typeof problem?.code === "string" ? problem.code : "";
    this.detail = detail;
    this.field = typeof problem?.field === "string" ? problem.field : null;
    this.errors = Array.isArray(problem?.errors)
      ? problem.errors.map((entry) => ({
        code: typeof entry?.code === "string" ? entry.code : "",
        field: typeof entry?.field === "string" ? entry.field : null,
        message: typeof entry?.message === "string" ? entry.message : "",
      }))
      : [];
    this.problem = problem;
    this.responseBody = rawText;
  }
}

function normalizeBaseUrl(rawValue) {
  let parsed;
  try {
    parsed = new URL(rawValue);
  } catch {
    throw new Error("Paymos API base_url is not a valid URL.");
  }

  const host = parsed.hostname.toLowerCase();
  const isLoopback = host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]";

  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLoopback)) {
    throw new Error(
      "Paymos API base_url must use HTTPS (HTTP is allowed only for loopback tests).",
    );
  }

  return rawValue.replace(/\/+$/, "");
}

export function validatePaymosAuth(auth) {
  if (!auth || typeof auth !== "object") {
    throw new Error("Paymos API credentials are required.");
  }

  const publicKey = String(auth.public_key ?? "").trim();
  const secretKey = String(auth.secret_key ?? "").trim();
  const rawBaseUrl = String(auth.base_url ?? PAYMOS_DEFAULT_BASE_URL).trim() ||
    PAYMOS_DEFAULT_BASE_URL;

  if (!publicKey) {
    throw new Error(
      "Paymos public_key is required (expected pk_live_... or pk_test_...).",
    );
  }

  if (publicKey.startsWith("rk_")) {
    throw new Error(
      "Payout API keys (rk_) are not supported in Paymos Pipedream components. Use a Payment API key starting with pk_live_ (Production) or pk_test_ (Sandbox).",
    );
  }

  let environment;
  if (publicKey.startsWith("pk_live_")) {
    environment = "production";
  } else if (publicKey.startsWith("pk_test_")) {
    environment = "sandbox";
  } else {
    throw new Error(
      "Invalid Paymos public_key prefix. Expected a Payment API key starting with pk_live_ (Production) or pk_test_ (Sandbox).",
    );
  }

  if (!secretKey) {
    throw new Error("Paymos secret_key is required.");
  }

  const baseUrl = normalizeBaseUrl(rawBaseUrl);

  return {
    publicKey,
    secretKey,
    baseUrl,
    environment,
  };
}

function requireNonEmptyString(value, fieldName) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed === "") {
    throw new Error(`${fieldName} is required and cannot be empty.`);
  }
  return trimmed;
}

function parseNonNegativeInteger(value, fieldName) {
  const num = Number(value);
  if (!Number.isSafeInteger(num) || num < 0) {
    throw new Error(`${fieldName} must be a non-negative integer.`);
  }
  return num;
}

export default {
  type: "app",
  app: "paymos",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Prefixed Paymos project identifier (e.g. `prj_...`). Find it in Paymos Dashboard -> Projects -> Details.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Prefixed Paymos invoice identifier (e.g. `inv_...`).",
    },
    channelId: {
      type: "string",
      label: "Payment Channel ID",
      description: "Prefixed Paymos payment channel identifier (e.g. `pch_...`).",
    },
  },
  methods: {
    validateCredentials() {
      return validatePaymosAuth(this.$auth);
    },

    async makeRequest({
      method = "GET",
      path,
      query,
      body,
      requireSandbox = false,
      fetchImpl,
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

      const fetcher = fetchImpl ?? this._fetchImpl ?? globalThis.fetch;
      if (typeof fetcher !== "function") {
        throw new Error("Fetch API is unavailable in this Node.js runtime.");
      }

      const requestInit = {
        method: upperMethod,
        headers,
      };
      if (bodyString !== "") {
        requestInit.body = bodyString;
      }

      const response = await fetcher(url, requestInit);
      const responseText = await response.text();

      if (!response.ok) {
        throw new PaymosApiError(response.status, responseText);
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
      projectId,
      amount,
      currency,
      externalOrderId,
      network,
      customerFeePercent,
      clientId,
      fetchImpl,
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
        method: "POST",
        path: "/v1/invoices",
        body,
        fetchImpl,
      });
    },

    async getInvoice({
      invoiceId,
      fetchImpl,
    } = {}) {
      const normalizedInvoiceId = requireNonEmptyString(invoiceId, "invoice_id");
      return this.makeRequest({
        method: "GET",
        path: `/v1/invoices/${encodePathSegment(normalizedInvoiceId)}`,
        fetchImpl,
      });
    },

    async listInvoices({
      projectId,
      status,
      externalOrderId,
      createdFrom,
      createdTo,
      limit,
      cursor,
      fetchImpl,
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
        method: "GET",
        path: "/v1/invoices",
        query,
        fetchImpl,
      });
    },

    async cancelInvoice({
      invoiceId,
      reason,
      fetchImpl,
    } = {}) {
      const normalizedInvoiceId = requireNonEmptyString(invoiceId, "invoice_id");
      const normalizedReason = requireNonEmptyString(reason, "reason");
      if (normalizedReason.length > 500) {
        throw new Error("reason must not exceed 500 characters.");
      }

      return this.makeRequest({
        method: "POST",
        path: `/v1/invoices/${encodePathSegment(normalizedInvoiceId)}/cancel`,
        body: {
          reason: normalizedReason,
        },
        fetchImpl,
      });
    },

    async simulateSandboxInvoice({
      invoiceId,
      stage,
      fetchImpl,
    } = {}) {
      const normalizedInvoiceId = requireNonEmptyString(invoiceId, "invoice_id");
      const normalizedStage = requireNonEmptyString(stage, "stage");
      if (!PAYMOS_SANDBOX_STAGES.includes(normalizedStage)) {
        throw new Error(
          `stage must be one of: ${PAYMOS_SANDBOX_STAGES.join(", ")}.`,
        );
      }

      return this.makeRequest({
        method: "POST",
        path: `/v1/sandbox/invoices/${encodePathSegment(normalizedInvoiceId)}/simulate-payment`,
        body: {
          stage: normalizedStage,
        },
        requireSandbox: true,
        fetchImpl,
      });
    },

    async createPaymentChannel({
      projectId,
      externalId,
      fetchImpl,
    } = {}) {
      const normalizedProjectId = requireNonEmptyString(projectId, "project_id");
      const normalizedExternalId = requireNonEmptyString(externalId, "external_id");
      if (normalizedExternalId.length > 128) {
        throw new Error("external_id must not exceed 128 characters.");
      }

      return this.makeRequest({
        method: "POST",
        path: "/v1/payment-channels",
        body: {
          project_id: normalizedProjectId,
          external_id: normalizedExternalId,
        },
        fetchImpl,
      });
    },

    async getPaymentChannel({
      channelId,
      fetchImpl,
    } = {}) {
      const normalizedChannelId = requireNonEmptyString(channelId, "channel_id");
      return this.makeRequest({
        method: "GET",
        path: `/v1/payment-channels/${encodePathSegment(normalizedChannelId)}`,
        fetchImpl,
      });
    },

    async createRefund({
      invoiceId,
      mode,
      externalOrderId,
      fetchImpl,
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
        method: "POST",
        path: "/v1/refunds",
        body,
        fetchImpl,
      });
    },
  },
};
