import { axios } from "@pipedream/platform";
import {
  DISTRIBUTOR_SERVICE_IDS,
  HEADER_SERVICE_ID,
  HRIS_SERVICE_IDS,
  MAX_LIMIT,
  MDM_SERVICE_IDS,
  MIN_LIMIT,
  UNIVERSAL_APIS,
  VELORY_SERVICE_ID,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "universal_api",
  propDefinitions: {
    universalApi: {
      type: "string",
      label: "Universal API",
      description:
        "The Universal API to use.",
      options: UNIVERSAL_APIS,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `The maximum number of results to return across all pages. Between ${MIN_LIMIT} and ${MAX_LIMIT}. Omit to return all available results.`,
      optional: true,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description:
        "Optional `x-uapi-service-id` header value to select a specific integration.",
      optional: true,
    },
    mdmServiceId: {
      type: "string",
      label: "Service ID",
      description: "`x-uapi-service-id` header identifying which MDM integration to use (required by the API for this endpoint). One of: `kandji`, `jamf`, `microsoft-intune`.",
      options: MDM_SERVICE_IDS,
    },
    hrisServiceId: {
      type: "string",
      label: "Service ID",
      description:
        "`x-uapi-service-id` header identifying which HRIS integration to use (required by the API for this endpoint). One of: `bamboohr`, `google-workspace`, `azure-active-directory`, `catalyst-one`, `haileyhr`, `deel`, `sap`.",
      options: HRIS_SERVICE_IDS,
    },
    distributorServiceId: {
      type: "string",
      label: "Service ID",
      description: "`x-uapi-service-id` header identifying which Distributor integration to use (required by the API for this endpoint). One of: `webmercs`, `netset`.",
      options: DISTRIBUTOR_SERVICE_IDS,
    },
    consumerId: {
      type: "string",
      label: "Consumer ID",
      description:
        "The consumer ID. Run **List Consumers** first to find valid IDs.",
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description:
        "The HRIS employee ID. Run **List HRIS Employees** first to find valid IDs (e.g. `emp_12345`).",
    },
    depTokenId: {
      type: "string",
      label: "DEP Token ID",
      description:
        "The DEP token ID. Run **List MDM DEP Tokens** first to find valid IDs.",
    },
    vppTokenId: {
      type: "string",
      label: "VPP Token ID",
      description:
        "The VPP token ID. Run **List MDM VPP Tokens** first to find valid IDs.",
    },
    productId: {
      type: "string",
      label: "Product ID",
      description:
        "The distributor product ID. Run **List Distributor Products** first to find valid IDs.",
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description:
        "The distributor order ID. Run **List Distributor Orders** first to find valid IDs.",
    },
    trackingId: {
      type: "string",
      label: "Tracking ID",
      description:
        "The carrier tracking ID for the shipment (e.g. `370729103270863456`).",
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.server_url;
    },
    async _getScopedToken({
      $, scope, consumerId,
    }) {
      const response = await axios($, {
        baseURL: this._baseUrl(),
        method: "POST",
        url: "/api/auth",
        data: {
          apiKey: this.$auth.api_key,
          applicationId: this.$auth.application_id,
          consumerId,
          scope,
        },
      });
      return response?.accessToken ?? response?.data?.accessToken;
    },
    async _makeRequest({
      $ = this, headers, serviceId, scope = "consumer", consumerId, ...args
    }) {
      const token = await this._getScopedToken({
        $,
        scope,
        consumerId,
      });
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${token}`,
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
          ...headers,
        },
        ...args,
      });
    },
    async paginate({
      fn, args = {}, maxResults,
    }) {
      const data = [];
      let cursor;
      let hasMore = false;

      while (true) {
        const limit = maxResults
          ? Math.min(maxResults - data.length, MAX_LIMIT)
          : MAX_LIMIT;

        const response = await fn({
          ...args,
          limit,
          cursor,
        });
        const page = response?.data ?? [];
        data.push(...page);
        cursor = response?.meta?.next;

        if (maxResults && data.length >= maxResults) {
          hasMore = Boolean(cursor);
          break;
        }
        if (!cursor) {
          break;
        }
      }

      return {
        data,
        hasMore,
      };
    },
    // HRIS
    listHrisEmployees({
      $, consumerId, serviceId, group, limit, cursor,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/hris/employees",
        params: {
          group,
          limit,
          cursor,
        },
      });
    },
    getHrisEmployee({
      $, consumerId, employeeId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: `/api/hris/employees/${employeeId}`,
      });
    },
    listAmEmployees({
      $, consumerId, limit, cursor,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/employees",
        params: {
          limit,
          cursor,
        },
      });
    },
    listAmEquipmentItems({
      $, consumerId, limit, cursor,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/equipment-items",
        params: {
          limit,
          cursor,
        },
      });
    },
    listAmOrders({
      $, consumerId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/orders",
      });
    },
    listAmBudgets({
      $, consumerId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/budgets",
      });
    },
    listMdmDevices({
      $, consumerId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/mdm/devices",
      });
    },
    listMdmDeviceApps({
      $, consumerId, deviceId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: `/api/mdm/devices/${deviceId}/apps`,
      });
    },
    listMdmDepTokens({
      $, consumerId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/mdm/dep-tokens",
      });
    },
    getMdmDepToken({
      $, consumerId, depTokenId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: `/api/mdm/dep-tokens/${depTokenId}`,
      });
    },
    listMdmVppTokens({
      $, consumerId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/mdm/vpp-tokens",
      });
    },
    getMdmVppToken({
      $, consumerId, vppTokenId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: `/api/mdm/vpp-tokens/${vppTokenId}`,
      });
    },
    listMdmApnCerts({
      $, consumerId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/mdm/apn-certs",
      });
    },
    getMdmApnCert({
      $, consumerId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/mdm/apn-cert",
      });
    },
    trackShipment({
      $, consumerId, trackingId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: `/api/shipment/track/id/${trackingId}/statuses`,
      });
    },
    // Distributors
    listDistributorProducts({
      $, consumerId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/distributors/products",
      });
    },
    getDistributorProduct({
      $, consumerId, productId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: `/api/distributors/products/${productId}`,
      });
    },
    listDistributorOrders({
      $, consumerId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: "/api/distributors/orders",
      });
    },
    getDistributorOrder({
      $, consumerId, orderId, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        serviceId,
        url: `/api/distributors/orders/${orderId}`,
      });
    },
    createDistributorOrder({
      $, consumerId, data,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        method: "POST",
        url: "/api/distributors/orders",
        data,
      });
    },
    listConsumers({
      $, limit, cursor,
    }) {
      return this._makeRequest({
        $,
        scope: "application",
        url: "/api/consumers",
        params: {
          limit,
          cursor,
        },
      });
    },
    createConsumer({
      $, data,
    }) {
      return this._makeRequest({
        $,
        scope: "application",
        method: "POST",
        url: "/api/consumers",
        data,
      });
    },
    deleteConsumer({
      $, consumerId,
    }) {
      return this._makeRequest({
        $,
        scope: "application",
        method: "DELETE",
        url: `/consumers/${consumerId}`,
      });
    },
    listConnections({
      $, consumerId, universalApi, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        url: `/connections/${universalApi}/${serviceId}`,
      });
    },
    getConnection({
      $, consumerId, universalApi, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        url: `/api/connections/${universalApi}/${serviceId}`,
      });
    },
    updateConnection({
      $, consumerId, universalApi, serviceId, data,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        method: "PATCH",
        url: `/api/connections/${universalApi}/${serviceId}`,
        data,
      });
    },
    deleteConnection({
      $, consumerId, universalApi, serviceId,
    }) {
      return this._makeRequest({
        $,
        consumerId,
        method: "DELETE",
        url: `/api/connections/${universalApi}/${serviceId}`,
      });
    },
  },
};
