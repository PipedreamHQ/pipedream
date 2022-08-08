import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import { GetShipmentParams, HttpRequestParams } from "../common/requestParams";
import { Address, Shipment } from "../common/responseSchemas";

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
    async createShipment({
      id,
      ...params
    }: GetShipmentParams): Promise<Shipment> {
      return this._httpRequest({
        endpoint: `/shipments/${id}`,
        ...params,
      });
    },
    async listShipments(): Promise<Shipment[]> {
      const response = await this._httpRequest({
        endpoint: "/shipments",
      });

      return response.shipments;
    },
    async getShipment({ id, ...params }: GetShipmentParams): Promise<Shipment> {
      return this._httpRequest({
        endpoint: `/shipments/${id}`,
        ...params,
      });
    },
    getShipmentLabel({ packages, price, to }: Shipment) {
      return `${packages.length} packages ($${price}) to ${this.getAddressLabel(to)}`;
    },
    async listAddresses(): Promise<Address[]> {
      const response = await this._httpRequest({
        endpoint: "/addresses",
      });

      return response.addresses;
    },
    getAddressLabel({
      first_name,
      last_name,
      street,
      street_no,
      zip_code,
      city,
      country,
    }: Address) {
      return `${first_name} ${last_name} - ${street_no} ${street}, ${city} ${zip_code} (${country})`;
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
    address: {
      type: "object",
      label: "Recipient Address",
      description: `Select an **Address** from the list.
        \\
        Alternatively, you can provide a custom [Address object](https://developers.shipcloud.io/reference/#creating-an-address).`,
      async options() {
        const addresses: Address[] = await this.listAddresses();

        return addresses.map((address) => {
          return {
            label: this.getAddressLabel(address),
            value: address,
          };
        });
      },
    },
    carrier: {
      type: "string",
      label: "Carrier",
      description: "The carrier you want to use",
      options: [
        "angel_de",
        "cargo_international",
        "dhl",
        "dhl_express",
        "dpag",
        "dpd",
        "gls",
        "go",
        "hermes",
        "iloxx",
        "parcel_one",
        "ups",
      ],
      service: {
        type: "string",
        label: "Service",
        description: "The service that should be used for the shipment",
        options: [
          "standard",
          "one_day",
          "one_day_early",
          "returns",
          "asendia_epaq_standard_economy",
          "asendia_epaq_standard_priority",
          "cargo_international_express",
          "dhl_europaket",
          "dhl_prio",
          "dhl_warenpost",
          "dpag_warenpost",
          "dpag_warenpost_signature",
          "dpag_warenpost_untracked",
          "gls_express_0800",
          "gls_express_0900",
          "gls_express_1000",
          "gls_express_1200",
          "ups_express_1200",
        ],
      },
      package: {
        type: "object",
        label: "Package",
        description:
          "Object describing the package [(more info on the Shipcloud Docs)](https://developers.shipcloud.io/reference/#creating-a-shipment)",
      },
    },
  },
});
