import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { GetShipmentParams, HttpRequestParams } from "../types/requestParams";
import { Shipment } from "../types/responseSchemas";

export default defineApp({
  type: "app",
  app: "shipcloud",
  methods: {
    _baseUrl(): string {
      return "https://api.shipcloud.io/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        auth: {
          username: this.$auth.api_key,
          password: "",
        },
        ...args,
      });
    },
    // async hookResponseRequest(apiUrl: string): Promise<object> {
    //   if (!(apiUrl && apiUrl.startsWith(this._baseUrl()))) {
    //     return {
    //       noUrl: true,
    //     };
    //   }

    //   return this._httpRequest({
    //     url: apiUrl,
    //   });
    // },
    // async createHook(data: CreateHookParams): Promise<Webhook> {
    //   return this._httpRequest({
    //     endpoint: "/hooks",
    //     method: "POST",
    //     data,
    //   });
    // },
    // async deleteHook({ key }: DeleteHookParams): Promise<number> {
    //   return this._httpRequest({
    //     endpoint: `/hooks/${key}`,
    //     method: "DELETE",
    //   });
    // },
    async listShipments(): Promise<Shipment[]> {
      const response = await this._httpRequest({
        endpoint: "/shipments",
      });

      return response.companies;
    },
    async getShipment({ id, ...params }: GetShipmentParams): Promise<Shipment> {
      return this._httpRequest({
        endpoint: `/shipments/${id}`,
        ...params,
      });
    },
    getShipmentLabel({ packages, price, to }: Shipment) {
      return `${packages.length} packages ($${price}) to ${to.zip_code} (${to.country})`;
    },
  },
  propDefinitions: {
    shipmentId: {
      type: "integer",
      label: "Shipment",
      description: `Select a **Shipment** from the list.
        \\
        Alternatively, you can provide a custom *Shipment ID*.`,
      async options() {
        const shipments: Shipment[] = await this.listShipments();

        return shipments.map((shipment) => {
          return {
            label: this.getShipmentLabel(shipment),
            value: shipment.id,
          };
        });
      },
    },
  },
});
