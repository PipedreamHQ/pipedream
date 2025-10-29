import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ticketsauce",
  propDefinitions: {
    partnerId: {
      type: "string",
      label: "Partner ID",
      description: "Including this ID will limit the result set to the specific partner.",
      optional: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "Including this ID will limit the result set to the specific organization.",
      optional: true,
    },
    includePerformers: {
      type: "boolean",
      label: "Include Performers",
      description: "If true, returns any associated performers/artists with the event.",
      optional: true,
      default: false,
    },
    eventId: {
      type: "string",
      label: "Event",
      description: "Select an event",
      async options({
        partnerId, organizationId,
      }) {
        const events = await this.listEvents(this, {
          partnerId,
          organizationId,
        });

        if (!events?.length) {
          return [];
        }

        const options = events.map((eventData) => ({
          label: `${eventData.Event.name} - ${eventData.Event.city} (${eventData.Event.start})`,
          value: eventData.Event.id,
        }));

        return options;
      },
    },
    orderId: {
      type: "string",
      label: "Order",
      description: "Select an order",
      async options({
        eventId, prevContext,
      }) {
        if (!eventId) {
          return [];
        }

        const orders = await this.listOrders(this, {
          eventId,
          params: {
            per_page: 100,
            page: prevContext?.page || 0,
          },
        });

        if (!orders?.length) {
          return prevContext?.page > 0
            ? {
              options: [],
              context: {},
            }
            : [];
        }

        const options = orders.map((orderData) => ({
          label: `${orderData.Order.first_name} ${orderData.Order.last_name} - ${orderData.Order.email} (${orderData.Order.total_paid})`,
          value: orderData.Order.id,
        }));

        return {
          options,
          context: {
            page: (prevContext?.page || 0) + 1,
          },
        };
      },
    },
  },
  methods: {
    _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      return axios($, {
        url: `https://api.ticketsauce.com/v2${path}`,
        params: {
          access_token: this.$auth.oauth_access_token,
          ...params,
        },
        ...opts,
      });
    },
    async listEvents($, {
      partnerId, organizationId, params,
    } = {}) {
      const requestParams = {
        ...params,
      };

      if (partnerId) {
        requestParams.partner_id = partnerId;
      }

      if (organizationId) {
        requestParams.organization_id = organizationId;
      }

      return this._makeRequest({
        $,
        path: "/events",
        params: requestParams,
      });
    },
    async getEventDetails($, {
      eventId, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/event/${eventId}`,
        params,
      });
    },
    async listOrders($, {
      eventId, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/orders/${eventId}`,
        params,
      });
    },
    async getOrderDetails($, { orderId }) {
      return this._makeRequest({
        $,
        path: `/order/${orderId}`,
      });
    },
    async getTicketCheckinIds($, {
      eventId, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/tickets/checkin_ids/${eventId}`,
        params,
      });
    },
  },
};
