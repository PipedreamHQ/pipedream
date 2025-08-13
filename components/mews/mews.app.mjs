import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mews",
  propDefinitions: {
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Raw payload fields to include in the request (e.g. filters).",
      optional: true,
    },
    reservationId: {
      type: "string",
      label: "Reservation ID",
      description: "The ID of the reservation to fetch.",
      async options() {
        const reservations = await this.reservationsGetAll();
        return reservations.map((reservation) => ({
          label: reservation.Id,
          value: reservation.Id,
        }));
      },
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "Identifier of the Service (bookable service). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/services#get-services)",
      async options() {
        const services = await this.servicesGetAll();
        return services.map((service) => ({
          label: service.Id,
          value: service.Id,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Identifier of the Customer who owns the reservation. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#get-customers)",
      async options() {
        const customers = await this.customersGetAll();
        return customers.map((customer) => ({
          label: customer.Id,
          value: customer.Id,
        }));
      },
    },
    startUtc: {
      type: "string",
      label: "Start (UTC)",
      description: "Start of the reservation in ISO 8601 (UTC).",
    },
    endUtc: {
      type: "string",
      label: "End (UTC)",
      description: "End of the reservation in ISO 8601 (UTC).",
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the reservation.",
      options: [
        "Optional",
        "Enquired",
        "Confirmed",
      ],
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "Identifier of the Resource (bookable resource). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/resources#get-resources)",
      optional: true,
      async options() {
        const resources = await this.resourcesGetAll();
        return resources.map((resource) => ({
          label: resource.Id,
          value: resource.Id,
        }));
      },
    },
    number: {
      type: "string",
      label: "Reservation Number",
      description: "Number of the reservation.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes of the reservation.",
      optional: true,
    },
    rateId: {
      type: "string",
      label: "Rate ID",
      description: "Identifier of the Rate. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/rates#get-rates)",
      optional: true,
      async options() {
        const rates = await this.ratesGetAll();
        return rates.map((rate) => ({
          label: rate.Id,
          value: rate.Id,
        }));
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Identifier of the Company. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/companies#get-companies)",
      optional: true,
      async options() {
        const companies = await this.companiesGetAll();
        return companies.map((company) => ({
          label: company.Id,
          value: company.Id,
        }));
      },
    },
    travelAgencyId: {
      type: "string",
      label: "Travel Agency ID",
      description: "Identifier of the Travel Agency. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/travel-agencies#get-travel-agencies)",
      optional: true,
      async options() {
        const travelAgencies = await this.travelAgenciesGetAll();
        return travelAgencies.map((travelAgency) => ({
          label: travelAgency.Id,
          value: travelAgency.Id,
        }));
      },
    },
    businessSegmentId: {
      type: "string",
      label: "Business Segment ID",
      description: "Identifier of the Business Segment. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/business-segments#get-business-segments)",
      optional: true,
      async options() {
        const businessSegments = await this.businessSegmentsGetAll();
        return businessSegments.map((businessSegment) => ({
          label: businessSegment.Id,
          value: businessSegment.Id,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.mews.com/api/connector/v1${path}`;
    },
    getAuthData(data) {
      const {
        ClientToken: clientToken,
        AccessToken: accessToken,
        Client: client,
      } = this.$auth;
      return {
        ...data,
        ClientToken: clientToken,
        AccessToken: accessToken,
        Client: client,
      };
    },
    _makeRequest({
      $ = this, path, data, ...args
    } = {}) {
      return axios($, {
        method: "POST",
        url: this.getUrl(path),
        data: this.getAuthData(data),
        ...args,
      });
    },
    reservationsGetAll(args = {}) {
      return this._makeRequest({
        path: "/reservations/getAll/2023-06-06",
        ...args,
      });
    },
    reservationsCreate(args = {}) {
      return this._makeRequest({
        path: "/reservations/create",
        ...args,
      });
    },
    reservationsUpdate(args = {}) {
      return this._makeRequest({
        path: "/reservations/update",
        ...args,
      });
    },
    reservationsCancel(args = {}) {
      return this._makeRequest({
        path: "/reservations/cancel",
        ...args,
      });
    },
    orderItemsGetAll(args = {}) {
      return this._makeRequest({
        path: "/orderItems/getAll",
        ...args,
      });
    },
    productsGetAll(args = {}) {
      return this._makeRequest({
        path: "/products/getAll",
        ...args,
      });
    },
    customersGetAll(args = {}) {
      return this._makeRequest({
        path: "/customers/getAll",
        ...args,
      });
    },
    productServiceOrdersGetAll(args = {}) {
      return this._makeRequest({
        path: "/productServiceOrders/getAll",
        ...args,
      });
    },
    servicesGetAll(args = {}) {
      return this._makeRequest({
        path: "/services/getAll",
        ...args,
      });
    },
    resourcesGetAll(args = {}) {
      return this._makeRequest({
        path: "/resources/getAll",
        ...args,
      });
    },
    ratesGetAll(args = {}) {
      return this._makeRequest({
        path: "/rates/getAll",
        ...args,
      });
    },
    companiesGetAll(args = {}) {
      return this._makeRequest({
        path: "/companies/getAll",
        ...args,
      });
    },
    travelAgenciesGetAll(args = {}) {
      return this._makeRequest({
        path: "/travelAgencies/getAll",
        ...args,
      });
    },
    businessSegmentsGetAll(args = {}) {
      return this._makeRequest({
        path: "/businessSegments/getAll",
        ...args,
      });
    },
    async paginate({
      requester,
      requesterArgs = {},
      resultKey,
      count = 100,
      maxRequests = 3,
    } = {}) {
      const items = [];
      let next;
      let requestCount = 0;

      while (true) {
        if (requestCount >= maxRequests) {
          break;
        }

        const response = await requester({
          ...requesterArgs,
          data: {
            ...requesterArgs?.data,
            Limitation: {
              Cursor: next,
              Count: count,
            },
          },
        });

        items.push(...(response?.[resultKey] || []));

        next = response?.Limitation?.Cursor ?? null;
        requestCount += 1;

        if (!next) {
          break;
        }
      }

      return items;
    },
  },
};
