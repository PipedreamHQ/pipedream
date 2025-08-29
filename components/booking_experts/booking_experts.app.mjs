import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "booking_experts",
  propDefinitions: {
    administrationId: {
      type: "string",
      label: "Administration ID",
      description: "The ID of the administration",
      async options({ page }) {
        const { data } = await this.listAdministrations({
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.name,
          value: id,
        })) || [];
      },
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "The ID of an owner",
      optional: true,
      async options({
        page, administrationId,
      }) {
        const { data } = await this.listOwners({
          administrationId,
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.first_name + " " + attributes.last_name,
          value: id,
        })) || [];
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of a channel",
      optional: true,
      async options({
        page, administrationId,
      }) {
        const { data } = await this.listChannels({
          administrationId,
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.name,
          value: id,
        })) || [];
      },
    },
    reservationId: {
      type: "string",
      label: "Reservation ID",
      description: "The ID of a reservation",
      async options({
        page, administrationId,
      }) {
        const { data } = await this.listReservations({
          administrationId,
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: `${attributes.start_date} - ${attributes.end_date}`,
          value: id,
        })) || [];
      },
    },
    masterPriceListId: {
      type: "string",
      label: "Master Price List ID",
      description: "The ID of a master price list",
      async options({
        page, administrationId,
      }) {
        const { data } = await this.listMasterPriceLists({
          administrationId,
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.name,
          value: id,
        })) || [];
      },
    },
    inventoryObjectId: {
      type: "string",
      label: "Inventory Object ID",
      description: "The ID of an inventory object",
      optional: true,
      async options({
        page, administrationId,
      }) {
        const { data } = await this.listInventoryObjects({
          administrationId,
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.name_with_type,
          value: id,
        })) || [];
      },
    },
    rentableId: {
      type: "string",
      label: "Rentable ID",
      description: "The ID of a rentable",
      async options({
        page, administrationId, inventoryObjectId,
      }) {
        const { data } = await this.listRentables({
          administrationId,
          params: {
            "page[number]": page + 1,
            "filter[inventory_object]": inventoryObjectId,
          },
        });
        return data?.map(({
          id, attributes,
        }) => ({
          label: attributes.name,
          value: id,
        })) || [];
      },
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of items per page",
      max: 100,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bookingexperts.com/v3";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
          "accept": "application/vnd.api+json",
        },
        ...opts,
      });
    },
    getComplexPrices({
      administrationId, masterPriceListId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/master_price_lists/${masterPriceListId}/complex_prices`,
        ...opts,
      });
    },
    listAdministrations(opts = {}) {
      return this._makeRequest({
        path: "/administrations",
        ...opts,
      });
    },
    listBookings({
      administrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/bookings`,
        ...opts,
      });
    },
    listOwners({
      administrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/owners`,
        ...opts,
      });
    },
    listChannels({
      administrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/channels`,
        ...opts,
      });
    },
    listReservations({
      administrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/reservations`,
        ...opts,
      });
    },
    listMasterPriceLists({
      administrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/master_price_lists`,
        ...opts,
      });
    },
    listInventoryObjects({
      administrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/inventory_objects`,
        ...opts,
      });
    },
    listRentables({
      administrationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/rentables`,
        ...opts,
      });
    },
    searchContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/search/first",
        ...opts,
      });
    },
    createAgendaPeriod({
      administrationId, type, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/${type}`,
        method: "POST",
        ...opts,
      });
    },
    addGuestToReservation({
      administrationId, reservationId, ...opts
    }) {
      return this._makeRequest({
        path: `/administrations/${administrationId}/reservations/${reservationId}/guests`,
        method: "POST",
        ...opts,
      });
    },
  },
};
