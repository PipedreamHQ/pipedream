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
      description: "The ID of the batch (e.g., `B-xxxx`). Use **Create Batch** to create a batch and retrieve its ID.",
    },
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "The ID of the payment (e.g., `P-xxxx`). Use **Create Payment** to create a payment and retrieve its ID.",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice. Use **Create Invoice** to create an invoice and retrieve its ID.",
    },
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "The ID, email address, or external ID of the recipient (e.g., `R-xxxx`, `user@example.com`, or your internal reference ID).",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Three-letter ISO 4217 currency code (e.g., `USD`, `EUR`, `GBP`).",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your external reference identifier for this record.",
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "A short note visible to the recipient. Max 1024 characters.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for this record (for metadata, search, and indexing).",
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
      const methodSendsJsonBody = method === "POST" || method === "PATCH";
      const serializedBody = requestBody
        ? JSON.stringify(requestBody)
        : (methodSendsJsonBody
          ? "{}"
          : "");
      const { headers: authHeaders } = this._buildPrsignHeaders(
        method,
        pathForSignature,
        serializedBody,
      );

      return axios($, {
        method,
        url: `${this._baseUrl()}${resourcePath}`,
        headers: authHeaders,
        ...(methodSendsJsonBody && {
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
