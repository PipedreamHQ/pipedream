import crypto from "crypto";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";

const TROLLEY_API_ORIGIN = "https://api.trolley.com";
const TROLLEY_API_VERSION_PREFIX = "/v1";

export default {
  type: "app",
  app: "trolley",
  propDefinitions: {
    batchId: {
      type: "string",
      label: "Batch ID",
      description: "The ID of the batch (e.g., `B-xxxx`). Use the **List Batches** action to find available batch IDs.",
    },
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "The ID of the payment (e.g., `P-xxxx`). Use the **List Payments** action to find available payment IDs for a given batch.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice (e.g., `I-a1b2c3d4`). Use the **List Invoices** action to find available invoice IDs.",
    },
    invoiceLineId: {
      type: "string",
      label: "Invoice Line ID",
      description: "The ID of a line within an invoice (e.g., `IL-xxxx`). Use the **List Invoice Lines** action with the Invoice ID to find available line IDs.",
    },
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "The ID of the recipient (e.g., `R-xxxx`). Use the **List Recipients** action to find available recipient IDs.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Three-letter ISO 4217 currency code (e.g., `USD`, `EUR`, `GBP`).",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your system's identifier for this record, used to correlate Trolley records with your own data (e.g., `order-12345`, `client-abc`, `inv_9x8y7z`). Must be unique within your account.",
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "A short note visible to the recipient. Max 1024 characters.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of string labels to attach to this record for filtering and search (e.g., `[\"us-payroll\", \"q2-2024\"]` or `[\"contractor\", \"marketing\"]`). Tags are freeform — use any consistent convention that fits your workflow.",
    },
    coverFees: {
      type: "boolean",
      label: "Cover Fees",
      description: "If `true`, the merchant covers the network fees for this payment.",
    },
  },
  methods: {
    _baseUrl() {
      return `${TROLLEY_API_ORIGIN}${TROLLEY_API_VERSION_PREFIX}`;
    },

    _requireAuthKeys() {
      const {
        access_key: accessKey, secret_key: secretKey,
      } = this.$auth;
      if (!accessKey || !secretKey) {
        throw new ConfigurationError(
          "Trolley connected account is missing credentials. Configure both **Access Key** and **Secret Key** on the connected account.",
        );
      }
      return {
        accessKey,
        secretKey,
      };
    },

    /**
     * Trolley `prsign` HMAC: message is timestamp, HTTP method (uppercase), path
     * (including `/v1…`), JSON body string, each separated by newlines, ending with a newline.
     * @see https://developers.trolley.com/api/#authentication
     */
    _buildPrsignHeaders(httpMethod, pathForSignature, serializedBody = "") {
      const {
        accessKey, secretKey,
      } = this._requireAuthKeys();
      const timestampSeconds = Math.floor(Date.now() / 1000).toString();
      const normalizedMethod = httpMethod.toUpperCase();
      const signaturePayload = `${timestampSeconds}\n${normalizedMethod}\n${pathForSignature}\n${serializedBody}\n`;
      const requestSignature = crypto
        .createHmac("sha256", secretKey)
        .update(signaturePayload)
        .digest("hex");

      return {
        headers: {
          "Authorization": `prsign ${accessKey}:${requestSignature}`,
          "Content-Type": "application/json",
          "X-PR-Timestamp": timestampSeconds,
        },
      };
    },

    _buildQueryString(queryParams) {
      if (!queryParams) {
        return "";
      }
      const searchParams = new URLSearchParams();
      for (const [
        paramName,
        paramValue,
      ] of Object.entries(queryParams)) {
        if (paramValue === undefined || paramValue === null) {
          continue;
        }
        if (Array.isArray(paramValue)) {
          for (const entry of paramValue) {
            searchParams.append(paramName, entry);
          }
        } else {
          searchParams.append(paramName, paramValue);
        }
      }
      const encoded = searchParams.toString();
      return encoded
        ? `?${encoded}`
        : "";
    },

    async _makeRequest({
      $ = this,
      method = "GET",
      path,
      params: queryParams,
      data: requestBody,
    } = {}) {
      const queryString = this._buildQueryString(queryParams);
      const resourcePath = `${path}${queryString}`;
      const pathForSignature = `${TROLLEY_API_VERSION_PREFIX}${resourcePath}`;
      const hasJsonBody = requestBody !== undefined;
      const serializedBody = hasJsonBody
        ? JSON.stringify(requestBody)
        : "";
      const { headers: authHeaders } = this._buildPrsignHeaders(
        method,
        pathForSignature,
        serializedBody,
      );

      return axios($, {
        method,
        url: `${this._baseUrl()}${resourcePath}`,
        headers: authHeaders,
        ...(hasJsonBody && {
          // Must match the string used for HMAC signing byte-for-byte.
          data: serializedBody,
        }),
      });
    },

    createBatch({
      $, batch, payments,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/batches",
        data: {
          ...batch,
          ...(payments?.length && {
            payments,
          }),
        },
      });
    },

    getBatchSummary({
      $, batchId,
    }) {
      return this._makeRequest({
        $,
        path: `/batches/${batchId}/summary`,
      });
    },

    startBatchProcessing({
      $, batchId,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/batches/${batchId}/start-processing`,
      });
    },

    createPayment({
      $, batchId, payment,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/batches/${batchId}/payments`,
        data: payment,
      });
    },

    getPayment({
      $, paymentId,
    }) {
      return this._makeRequest({
        $,
        path: `/payments/${paymentId}`,
      });
    },

    getInvoice({
      $ = this, invoiceId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/invoices/get",
        data: {
          invoiceId,
        },
      });
    },

    createInvoice({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/invoices/create",
        data,
      });
    },

    searchInvoices({
      $, body,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/invoices/search",
        data: body,
      });
    },

    createInvoicePayment({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/invoices/payment/create",
        data,
      });
    },

    listRecipients({
      $ = this, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/recipients",
        params,
      });
    },

    listBatches({
      $ = this, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/batches",
        params,
      });
    },

    listPayments({
      $ = this, batchId, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/batches/${batchId}/payments`,
        params,
      });
    },

    listBalances({ $ } = {}) {
      return this._makeRequest({
        $,
        path: "/balances",
      });
    },

    listVerifications({
      $ = this,
      params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/verifications",
        params,
      });
    },
  },
};
