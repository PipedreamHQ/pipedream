import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "shipengine",
  propDefinitions: {
    carrierId: {
      type: "string",
      label: "Carrier ID",
      description: "The ID of the carrier. E.g. `se-28529731`",
      async options({
        mapper = ({
          friendly_name: label, carrier_id: value,
        }) => ({
          label,
          value,
        }),
      }) {
        const { carriers } = await this.listCarriers();
        return carriers.map(mapper);
      },
    },
    serviceCode: {
      type: "string",
      label: "Service Code",
      description: "The service code of the label.",
      async options({
        carrierId,
        mapper = ({
          name: label, service_code: value,
        }) => ({
          value,
          label,
        }),
      }) {
        if (!carrierId) {
          return [];
        }
        const { services } = await this.listCarrierServices({
          carrierId,
        });
        return services.map(mapper);
      },
    },
    labelId: {
      type: "string",
      label: "Label ID",
      description: "The ID of the shipping label. E.g. `se-28529731`",
      async options({
        page, mapper = ({ label_id: value }) => value,
      }) {
        const { labels } = await this.listLabels({
          params: {
            page: page + 1,
          },
        });
        return labels.map(mapper);
      },
    },
    shipmentId: {
      type: "string",
      label: "Shipment ID",
      description: "The ID of the shipment. E.g. `se-28529731`",
      async options({
        page, mapper = ({ shipment_id: value }) => value,
      }) {
        const { shipments } = await this.listShipments({
          params: {
            page: page + 1,
          },
        });
        return shipments.map(mapper);
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "API-Key": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    listCarriers(args = {}) {
      return this.makeRequest({
        path: "/carriers",
        ...args,
      });
    },
    listCarrierServices({
      carrierId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/carriers/${carrierId}/services`,
        ...args,
      });
    },
    listLabels(args = {}) {
      return this.makeRequest({
        path: "/labels",
        ...args,
      });
    },
    listShipments(args = {}) {
      return this.makeRequest({
        path: "/shipments",
        ...args,
      });
    },
    async *getResourcesStream({
      resourcesFn,
      resourcesFnArgs,
      resourcesName,
      max = constants.MAX_RESOURCES,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const { [resourcesName]: nextResources } =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              page,
              ...resourcesFnArgs.params,
            },
          });

        if (!nextResources?.length) {
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        page += 1;
      }
    },
  },
};
