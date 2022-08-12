import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateHookParams,
  CreateShipmentParams,
  CreateShipmentQuoteParams,
  DeleteHookParams,
  GetShipmentParams, HttpRequestParams,
} from "../common/requestParams";
import {
  Address, Shipment, ShipmentQuote, Webhook,
} from "../common/responseSchemas";
import {
  CARRIER_OPTIONS, SERVICE_OPTIONS,
} from "../common/constants";

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
    async createHook(data: CreateHookParams): Promise<Webhook> {
      return this._httpRequest({
        endpoint: "/webhooks",
        method: "POST",
        data,
      });
    },
    async deleteHook({ id }: DeleteHookParams): Promise<any> {
      return this._httpRequest({
        endpoint: `/webhooks/${id}`,
        method: "DELETE",
      });
    },
    async createShipment(params: CreateShipmentParams): Promise<Shipment> {
      return this._httpRequest({
        method: "POST",
        endpoint: "/shipments",
        ...params,
      });
    },
    async listShipments(): Promise<Shipment[]> {
      const response = await this._httpRequest({
        endpoint: "/shipments",
      });

      return response.shipments;
    },
    async getShipment({
      id, ...params
    }: GetShipmentParams): Promise<Shipment> {
      return this._httpRequest({
        endpoint: `/shipments/${id}`,
        ...params,
      });
    },
    getShipmentLabel({
      packages, price, to,
    }: Shipment) {
      return `${packages.length} packages ($${price}) to ${this.getAddressLabel(
        to,
      )}`;
    },
    async createShipmentQuote(params: CreateShipmentQuoteParams): Promise<ShipmentQuote> {
      return this._httpRequest({
        method: "POST",
        endpoint: "/shipment_quotes",
        ...params,
      });
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
      type: "string",
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
      type: "string",
      label: "Recipient Address",
      description: `Select an **Address** from the list.
        \\
        Alternatively, you can provide a custom JSON-stringified [Address object](https://developers.shipcloud.io/reference/#creating-an-address).`,
      async options() {
        const addresses: Address[] = await this.listAddresses();

        return addresses.map((address) => {
          return {
            label: this.getAddressLabel(address),
            value: JSON.stringify(address),
          };
        });
      },
    },
    carrier: {
      type: "string",
      label: "Carrier",
      description: "The carrier you want to use",
      options: CARRIER_OPTIONS,
    },
    service: {
      type: "string",
      label: "Service",
      description: "The service that should be used for the shipment",
      options: SERVICE_OPTIONS,
    },
    package: {
      type: "object",
      label: "Package",
      description:
        "Object describing the package [(more info on the Shipcloud Docs)](https://developers.shipcloud.io/reference/#creating-a-shipment)",
    },
  },
});
