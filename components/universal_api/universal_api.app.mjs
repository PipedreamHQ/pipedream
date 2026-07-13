import { axios } from "@pipedream/platform";
import {
  HEADER_SERVICE_ID,
  MAX_LIMIT,
  MDM_SERVICE_IDS,
  MIN_LIMIT,
  SSO_SERVICE_IDS,
  UNIVERSAL_APIS,
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
    cursor: {
      type: "string",
      label: "Cursor",
      description:
        "Pagination cursor taken from a previous response's `meta.next`. Omit for the first page.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of items to return. Between ${MIN_LIMIT} and ${MAX_LIMIT}.`,
      optional: true,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description:
        "Optional `x-uapi-service-id` header value to select a specific integration.",
    },
    mdmServiceId: {
      type: "string",
      label: "Service ID",
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active MDM integrations. One of: `kandji`, `jamf`, `microsoft-intune`.",
      options: MDM_SERVICE_IDS,
    },
    ssoServiceId: {
      type: "string",
      label: "Service ID",
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active SSO integrations. One of: `google-saml`, `azure-saml`, `google-oidc`, `azure-oidc`.",
      options: SSO_SERVICE_IDS,
    },
    consumerId: {
      type: "string",
      label: "Consumer ID",
      description:
        "The consumer ID. Run **List Consumers** first to find valid IDs.",
    },
    connectionId: {
      type: "string",
      label: "Connection ID",
      description:
        "The connection ID. Run **List Connections** first to find valid IDs.",
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
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        ...args,
      });
    },
    // HRIS
    listHrisEmployees({
      $, serviceId, group, cursor, limit,
    }) {
      return this._makeRequest({
        $,
        url: "/api/hris/employees",
        params: {
          group,
          cursor,
          limit,
        },
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    getHrisEmployee({
      $, employeeId, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/hris/employees/${employeeId}`,
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    listAmEmployees({
      $, cursor, limit,
    }) {
      return this._makeRequest({
        $,
        url: "/api/am/employees",
        params: {
          cursor,
          limit,
        },
        headers: {
          [HEADER_SERVICE_ID]: "velory",
        },
      });
    },
    listAmEquipmentItems({
      $, cursor, limit,
    }) {
      return this._makeRequest({
        $,
        url: "/api/am/equipment-items",
        params: {
          cursor,
          limit,
        },
        headers: {
          [HEADER_SERVICE_ID]: "velory",
        },
      });
    },
    listAmOrders({
      $, cursor, limit,
    }) {
      return this._makeRequest({
        $,
        url: "/api/am/orders",
        params: {
          cursor,
          limit,
        },
        headers: {
          [HEADER_SERVICE_ID]: "velory",
        },
      });
    },
    listAmBudgets({
      $, cursor, limit,
    }) {
      return this._makeRequest({
        $,
        url: "/api/am/budgets",
        params: {
          cursor,
          limit,
        },
        headers: {
          [HEADER_SERVICE_ID]: "velory",
        },
      });
    },
    getSsoProfile({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: "/api/sso/profile",
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    listMdmDevices({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: "/api/mdm/devices",
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
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
        url: "/api/mdm/dep-tokens",
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    getMdmDepToken({
      $, depTokenId, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/mdm/dep-tokens/${depTokenId}`,
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    listMdmVppTokens({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: "/api/mdm/vpp-tokens",
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    getMdmVppToken({
      $, vppTokenId, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/mdm/vpp-tokens/${vppTokenId}`,
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    listMdmApnCerts({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: "/api/mdm/apn-certs",
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    getMdmApnCert({
      $, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: "/api/mdm/apn-cert",
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    trackShipment({
      $, trackingId, serviceId,
    }) {
      return this._makeRequest({
        $,
        url: `/api/shipment/track/id/${trackingId}/statuses`,
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
      });
    },
    // Distributors
    listDistributorProducts({
      $, serviceId, cursor, limit,
    }) {
      return this._makeRequest({
        $,
        url: "/api/distributors/products",
        params: {
          cursor,
          limit,
        },
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
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
        url: "/api/distributors/orders",
        headers: {
          ...(serviceId && {
            [HEADER_SERVICE_ID]: serviceId,
          }),
        },
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
      $, cursor, limit,
    }) {
      return this._makeRequest({
        $,
        url: "/api/consumers",
        params: {
          cursor,
          limit,
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
