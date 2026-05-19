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
      description: "The ID of the batch (e.g., `B-xxxx`).",
      async options({ page }) {
        const { batches } = await this.listBatches({
          params: {
            page: page + 1,
            pageSize: 100,
          },
        });
        return batches.map(({
          id, description,
        }) => ({
          label: description
            ? `${description} (${id})`
            : id,
          value: id,
        }));
      },
    },
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "The ID of the payment (e.g., `P-xxxx`). Select a **Batch ID** first to load available payments.",
      async options({
        page, batchId,
      }) {
        if (!batchId) return [];
        const { payments } = await this.listPayments({
          batchId,
          params: {
            page: page + 1,
            pageSize: 100,
          },
        });
        return payments.map(({
          id, memo,
        }) => ({
          label: memo
            ? `${memo} (${id})`
            : id,
          value: id,
        }));
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice.",
      async options({ page }) {
        const { invoices } = await this.searchInvoices({
          body: {
            page: page + 1,
            pageSize: 100,
          },
        });
        return invoices.map(({
          id, description, invoiceNumber,
        }) => ({
          label: description
            ? `${description} (${id})`
            : invoiceNumber
              ? `Invoice #${invoiceNumber} (${id})`
              : id,
          value: id,
        }));
      },
    },
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "The ID of the recipient (e.g., `R-xxxx`).",
      async options({ page }) {
        const { recipients } = await this.listRecipients({
          params: {
            page: page + 1,
            pageSize: 100,
          },
        });
        return recipients.map(({
          id, email, firstName, lastName, name,
        }) => {
          const displayName = [
            firstName,
            lastName,
          ].filter(Boolean).join(" ") || name || email;
          return {
            label: displayName
              ? `${displayName} (${id})`
              : id,
            value: id,
          };
        });
      },
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
