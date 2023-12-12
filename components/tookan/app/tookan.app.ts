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
import { CreateTaskResponse } from "../common/responseSchemas";
import timezoneOptions from "../common/timezones";

export default defineApp({
  type: "app",
  app: "tookan",
  propDefinitions: {
    timezone: {
      label: "Time Zone",
      description: `Select a **time zone** from the list.
        \\
        You can also provide a custom value indicating the difference with UTC in minutes, such as \`+480\` for PST.`,
      type: "string",
      options: timezoneOptions,
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
      description: "Any optional parameters to pass to the request [(see the Tookan API docs for available parameters)](https://tookanapi.docs.apiary.io/#reference/task/create-task)",
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
      const response: CreateTaskResponse = await this._httpRequest({
        endpoint: "/create_task",
        method: "POST",
        ...params,
      });

      if (response.status !== 200) {
        throw new Error("Tookan response: " + response.message);
      }

      return response.data;
    },
    async createAppointmentTask(params: CreateAppointmentTaskParams): Promise<object> {
      return this.createTask(params);
    },
    async createDeliveryTask(params: CreateDeliveryTaskParams): Promise<object> {
      return this.createTask(params);
    },
    async createFieldWorkforceTask(params: CreateFieldWorkforceTaskParams): Promise<object> {
      return this.createTask(params);
    },
    async createPickupAndDeliveryTask(
      params: CreatePickupAndDeliveryTaskParams,
    ): Promise<object> {
      return this.createTask(params);
    },
    async createPickupTask(params: CreatePickupTaskParams): Promise<object> {
      return this.createTask(params);
    },
  },
});
