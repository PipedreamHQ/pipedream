import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";

export default {
  type: "app",
  app: "microsoft_bookings",
  propDefinitions: {
    businessId: {
      type: "string",
      label: "Business",
      description: "Select a booking business",
      async options({ prevContext }) {
        const response = prevContext?.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listBusinesses();

        const options = response.value?.map((business) => ({
          label: business.displayName,
          value: business.id,
        })) || [];

        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    staffMemberId: {
      type: "string",
      label: "Staff Member",
      description: "Select a staff member",
      async options({
        businessId, prevContext,
        mapper = ({
          displayName: label,
          id: value,
        }) => ({
          label,
          value,
        }),
      }) {
        const response = prevContext?.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listStaffMembers({
            businessId,
          });

        const options = response.value?.map(mapper) || [];

        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    serviceId: {
      type: "string",
      label: "Service",
      description: "Select a service",
      async options({
        businessId, prevContext,
      }) {
        const response = prevContext?.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listServices({
            businessId,
          });

        const options = response.value?.map((service) => ({
          label: service.displayName,
          value: service.id,
        })) || [];

        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer",
      description: "Select a customer",
      async options({
        businessId, prevContext,
      }) {
        const response = prevContext?.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listCustomers({
            businessId,
          });

        const options = response.value?.map((customer) => ({
          label: customer.displayName,
          value: customer.id,
        })) || [];

        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    appointmentId: {
      type: "string",
      label: "Appointment",
      description: "Select an appointment",
      async options({
        businessId, prevContext,
      }) {
        const response = prevContext?.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listAppointments({
            businessId,
          });

        const options = response.value?.map((appointment) => ({
          label: `${appointment.customerName} - ${appointment.serviceName}`,
          value: appointment.id,
        })) || [];

        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    client() {
      return Client.initWithMiddleware({
        authProvider: {
          getAccessToken: () => Promise.resolve(this._accessToken()),
        },
      });
    },
    async makeRequest({
      method = "get",
      path,
      content,
    }) {
      const api = this.client().api(path);

      if (method === "get") {
        return api.get();
      } else if (method === "post") {
        return api.post(content);
      } else if (method === "patch") {
        return api.patch(content);
      } else if (method === "delete") {
        return api.delete();
      }

      return api[method](content);
    },
    async listBusinesses() {
      return this.makeRequest({
        path: "/solutions/bookingBusinesses",
      });
    },
    async createBusiness({ content }) {
      return this.makeRequest({
        method: "post",
        path: "/solutions/bookingBusinesses",
        content,
      });
    },
    async listStaffMembers({ businessId }) {
      return this.makeRequest({
        path: `/solutions/bookingBusinesses/${businessId}/staffMembers`,
      });
    },
    async createStaffMember({
      businessId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/solutions/bookingBusinesses/${businessId}/staffMembers`,
        content,
      });
    },
    async listServices({ businessId }) {
      return this.makeRequest({
        path: `/solutions/bookingBusinesses/${businessId}/services`,
      });
    },
    async createService({
      businessId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/solutions/bookingBusinesses/${businessId}/services`,
        content,
      });
    },
    async listCustomers({ businessId }) {
      return this.makeRequest({
        path: `/solutions/bookingBusinesses/${businessId}/customers`,
      });
    },
    async createCustomer({
      businessId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/solutions/bookingBusinesses/${businessId}/customers`,
        content,
      });
    },
    async listAppointments({ businessId }) {
      return this.makeRequest({
        path: `/solutions/bookingBusinesses/${businessId}/appointments`,
      });
    },
    async createAppointment({
      businessId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/solutions/bookingBusinesses/${businessId}/appointments`,
        content,
      });
    },
    async cancelAppointment({
      businessId, appointmentId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/solutions/bookingBusinesses/${businessId}/appointments/${appointmentId}/cancel`,
        content,
      });
    },
    async getCalendarView({
      businessId, start, end,
    }) {
      return this.makeRequest({
        path: `/solutions/bookingBusinesses/${businessId}/calendarView?start=${start}&end=${end}`,
      });
    },
  },
};
