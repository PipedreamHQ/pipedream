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
      optional: true,
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
    searchContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/search/first",
        ...opts,
      });
    },
  },
};
