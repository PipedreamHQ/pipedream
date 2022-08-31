import { defineAction } from "@pipedream/types";
import { CreateDeliveryTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";

export default defineAction({
  ...common,
  name: "Create Delivery Task",
  description:
    "Create a delivery task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-a-delivery-task)",
  key: "tookan-create-delivery-task",
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
  },
  async run({ $ }) {
    const params: CreateDeliveryTaskParams = {
      $,
      data: {
        additionalOptions: this.additionalOptions,
        timezone: this.timezone,
        customer_address: this.customerAddress,
        job_delivery_datetime: this.jobDeliveryDatetime,
        has_delivery: 1,
        has_pickup: 0,
        layout_type: 0,
      },
    };
    const data: object = await this.tookan.createDeliveryTask(params);

    $.export("$summary", "Created delivery task successfully");

    return data;
  },
});
