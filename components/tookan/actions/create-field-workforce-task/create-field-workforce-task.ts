import { defineAction } from "@pipedream/types";
import { CreateFieldWorkforceTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";

export default defineAction({
  ...common,
  name: "Create Field Workforce Task",
  description:
    "Create a field workforce task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-a-field-workforce-task)",
  key: "tookan-create-field-workforce-task",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    customerAddress: {
      propDefinition: [
        tookan,
        "customerAddress",
      ],
    },
    jobDeliveryDatetime: {
      propDefinition: [
        tookan,
        "jobDeliveryDatetime",
      ],
    },
    jobPickupDatetime: {
      propDefinition: [
        tookan,
        "jobPickupDatetime",
      ],
    },
  },
  async run({ $ }) {
    const params: CreateFieldWorkforceTaskParams = {
      $,
      data: {
        additionalOptions: this.additionalOptions,
        timezone: this.timezone,
        customer_address: this.customerAddress,
        job_delivery_datetime: this.jobDeliveryDatetime,
        job_pickup_datetime: this.jobPickupDatetime,
        has_delivery: 0,
        has_pickup: 0,
        layout_type: 2,
      },
    };
    const data = await this.tookan.createFieldWorkforceTask(params);

    $.export("$summary", "Created field workforce task successfully");

    return data;
  },
});
