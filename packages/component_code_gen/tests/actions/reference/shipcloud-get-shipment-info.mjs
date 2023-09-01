import { axios } from "@pipedream/platform";

export default {
  name: "Get Shipment Info",
  description: "Retrieve details for a shipment [See docs here](https://developers.shipcloud.io/reference/#getting-information-about-a-shipment)",
  key: "shipcloud-get-shipment-info",
  version: "0.0.1",
  type: "action",
  props: {
    shipcloud: {
      type: "app",
      app: "shipcloud",
    },
    shipmentId: {
      type: "string",
      label: "Shipment",
      description: `Select a **Shipment** from the list.
        \\
        Alternatively, you can provide a custom *Shipment ID*.`,
      async options() {
        const shipments = await this.listShipments();

        return shipments.map((shipment) => {
          return {
            label: this.getShipmentLabel(shipment),
            value: shipment.id,
          };
        });
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.shipcloud.io/v1";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }) {
      return axios($, {
        url: this._baseUrl() + endpoint,
        auth: {
          username: this.$auth.api_key,
          password: "",
        },
        ...args,
      });
    },
    async listShipments() {
      const response = await this._httpRequest({
        endpoint: "/shipments",
      });

      return response.shipments ?? [];
    },
    async getShipment({
      id, ...params
    }) {
      return this._httpRequest({
        endpoint: `/shipments/${id}`,
        ...params,
      });
    },
    getShipmentLabel({
      packages, price, to,
    }) {
      return `${packages.length} packages ($${price}) to ${this.getAddressLabel(
        to,
      )}`;
    },
    getAddressLabel({
      first_name,
      last_name,
      street,
      street_no,
      zip_code,
      city,
      country,
    }) {
      return `${first_name} ${last_name} - ${street_no} ${street}, ${city} ${zip_code} (${country})`;
    },
  },
  async run({ $ }) {
    const params = {
      $,
      id: this.shipmentId,
    };
    const data = await this.getShipment(params);

    $.export(
      "$summary",
      "Retrieved shipment info successfully",
    );

    return data;
  },
};
