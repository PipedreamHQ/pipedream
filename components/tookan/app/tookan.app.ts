import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  CreateAppointmentTaskParams,
  CreateDeliveryTaskParams,
  CreateFieldWorkforceTaskParams,
  CreatePickupAndDeliveryTaskParams,
  CreatePickupTaskParams,
} from "../common/requestParams";

export default defineApp({
  type: "app",
  app: "tookan",
  propDefinitions: {
    timezone: {
      label: "Timezone",
      description: "Timezone difference with UTC",
      type: "string",
    },
    customerAddress: {
      label: "Customer Address",
      description:
        "This is the address of the customer to whom the product should be delivered",
      type: "string",
    },
    jobDeliveryDatetime: {
      label: "Job Delivery Date/Time",
      description:
        "This is the time before which the product should be delivered. Use a date/time string in the format `2016-08-14 19:00:00`",
      type: "string",
    },
    jobPickupDatetime: {
      label: "Job Pickup Date/Time",
      description:
        "This is time before which the pickup should be collected. Use a date/time string in the format `2016-08-14 19:00:00`",
      type: "string",
    },
    jobPickupAddress: {
      label: "Job Pickup Address",
      description: "The address from which the pickup should be collected",
      type: "string",
    },
    additionalOptions: {
      label: "Additional Options",
      description: "Any optional parameters to pass to the request",
      type: "object",
      optional: true,
    },
  },
  methods: {
    _baseUrl(): string {
      return "https://api.tookanapp.com/v2";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      data,
      method,
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          api_key: this.$auth.api_key,
          ...data,
        },
        method,
      });
    },
    async createTask(params: { data: object; }) {
      return this._httpRequest({
        endpoint: "/create_task",
        method: "POST",
        ...params,
      });
    },
    async createAppointmentTask(params: CreateAppointmentTaskParams) {
      return this.createTask(params);
    },
    async createDeliveryTask(params: CreateDeliveryTaskParams) {
      return this.createTask(params);
    },
    async createFieldWorkforceTask(params: CreateFieldWorkforceTaskParams) {
      return this.createTask(params);
    },
    async createPickupAndDeliveryTask(
      params: CreatePickupAndDeliveryTaskParams,
    ) {
      return this.createTask(params);
    },
    async createPickupTask(params: CreatePickupTaskParams) {
      return this.createTask(params);
    },
  },
});
