import { axios } from "@pipedream/platform";
import {
  CONNECTION_SERVICE_IDS,
  DISTRIBUTOR_SERVICE_IDS,
  HEADER_SERVICE_ID,
  HRIS_SERVICE_IDS,
  MAX_LIMIT,
  MDM_SERVICE_IDS,
  MIN_LIMIT,
  SSO_SERVICE_IDS,
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
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active MDM integrations. One of: `kandji`, `jamf`, `microsoft-intune`.",
      options: MDM_SERVICE_IDS,
      optional: true,
    },
    ssoServiceId: {
      type: "string",
      label: "Service ID",
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active SSO integrations. One of: `google-saml`, `azure-saml`, `google-oidc`, `azure-oidc`.",
      options: SSO_SERVICE_IDS,
      optional: true,
    },
    hrisServiceId: {
      type: "string",
      label: "Service ID",
      description:
        "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active HRIS integrations. One of: `bamboohr`, `google-workspace`, `azure-active-directory`, `catalyst-one`, `haileyhr`, `deel`, `sap`.",
      options: HRIS_SERVICE_IDS,
      optional: true,
    },
    connectionServiceId: {
      type: "string",
      label: "Service ID",
      description: "The service ID that, together with `universalApi`, identifies the connection (e.g. `kandji`, `jamf`, `teamtailor`).",
      options: CONNECTION_SERVICE_IDS,
      optional: false,
    },
    distributorServiceId: {
      type: "string",
      label: "Service ID",
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active Distributor integrations. One of: `webmercs`, `netset`.",
      options: DISTRIBUTOR_SERVICE_IDS,
      optional: true,
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
    async _makeRequest({
      $ = this, headers, serviceId, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
      $, serviceId, group, limit, cursor,
    }) {
      return this._makeRequest({
        $,
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
      $, employeeId, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: `/api/hris/employees/${employeeId}`,
      });
    },
    listAmEmployees({
      $, limit, cursor,
    }) {
      return this._makeRequest({
        $,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/employees",
        params: {
          limit,
          cursor,
        },
      });
    },
    listAmEquipmentItems({
      $, limit, cursor,
    }) {
      return this._makeRequest({
        $,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/equipment-items",
        params: {
          limit,
          cursor,
        },
      });
    },
    listAmOrders({ $ }) {
      return this._makeRequest({
        $,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/orders",
      });
    },
    listAmBudgets({ $ }) {
      return this._makeRequest({
        $,
        serviceId: VELORY_SERVICE_ID,
        url: "/api/am/budgets",
      });
    },
    getSsoProfile({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/sso/profile",
      });
    },
    listMdmDevices({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/mdm/devices",
      });
    },
    listMdmDeviceApps({
      $, deviceId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/mdm/devices/${deviceId}/apps`,
      });
    },
    listMdmDepTokens({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/mdm/dep-tokens",
      });
    },
    getMdmDepToken({
      $, depTokenId, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: `/api/mdm/dep-tokens/${depTokenId}`,
      });
    },
    listMdmVppTokens({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/mdm/vpp-tokens",
      });
    },
    getMdmVppToken({
      $, vppTokenId, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: `/api/mdm/vpp-tokens/${vppTokenId}`,
      });
    },
    listMdmApnCerts({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/mdm/apn-certs",
      });
    },
    getMdmApnCert({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/mdm/apn-cert",
      });
    },
    trackShipment({
      $, trackingId, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: `/api/shipment/track/id/${trackingId}/statuses`,
      });
    },
    // Distributors
    listDistributorProducts({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/distributors/products",
      });
    },
    getDistributorProduct({
      $, productId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/distributors/products/${productId}`,
      });
    },
    listDistributorOrders({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        serviceId,
        url: "/api/distributors/orders",
      });
    },
    getDistributorOrder({
      $, orderId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/distributors/orders/${orderId}`,
      });
    },
    createDistributorOrder({
      $, data,
    }) {
      return this._makeRequest({
        $,
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
        method: "DELETE",
        url: `/consumers/${consumerId}`,
      });
    },
    listConnections({
      $, universalApi, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: `/connections/${universalApi}/${serviceId}`,
      });
    },
    getConnection({
      $, universalApi, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/connections/${universalApi}/${serviceId}`,
      });
    },
    updateConnection({
      $, universalApi, serviceId, data,
    }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        url: `/api/connections/${universalApi}/${serviceId}`,
        data,
      });
    },
    deleteConnection({
      $, universalApi, serviceId,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        url: `/api/connections/${universalApi}/${serviceId}`,
      });
    },
  },
};
