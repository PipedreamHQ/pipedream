import { defineAction } from "@pipedream/types";
import { CreatePickupAndDeliveryTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";

export default defineAction({
  ...common,
  name: "Create Pickup And Delivery Task",
  description:
    "Create a pickup and delivery task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-a-pickup-and-delivery-task)",
  key: "tookan-create-pickup-and-delivery-task",
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
    jobPickupAddress: {
      propDefinition: [
        tookan,
        "jobPickupAddress",
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
    const params: CreatePickupAndDeliveryTaskParams = {
      $,
      data: {
        additionalOptions: this.additionalOptions,
        timezone: this.timezone,
        customer_address: this.customerAddress,
        job_delivery_datetime: this.jobDeliveryDatetime,
        job_pickup_address: this.jobPickupAddress,
        job_pickup_datetime: this.jobPickupDatetime,
        has_delivery: 1,
        has_pickup: 1,
        layout_type: 0,
      },
    };
    const data: object = await this.tookan.createPickupAndDeliveryTask(params);

    $.export("$summary", "Created pickup and delivery task successfully");

    return data;
  },
});
