import { defineAction } from "@pipedream/types";
import { CreatePickupAndDeliveryTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";
import { TaskData } from "../../common/responseSchemas";

export default defineAction({
  ...common,
  name: "Create Pickup And Delivery Task",
  description:
    "Create a pickup and delivery task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-a-pickup-and-delivery-task)",
  key: "tookan-create-pickup-and-delivery-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        timezone: this.timezone,
        customer_address: this.customerAddress,
        job_delivery_datetime: this.jobDeliveryDatetime,
        job_pickup_address: this.jobPickupAddress,
        job_pickup_datetime: this.jobPickupDatetime,
        has_delivery: 1,
        has_pickup: 1,
        layout_type: 0,
        ...this.additionalOptions,
      },
    };
    const data: TaskData = await this.tookan.createPickupAndDeliveryTask(
      params,
    );

    $.export(
      "$summary",
      `Created pickup and delivery task successfully (id ${data.job_id})`,
    );

    return data;
  },
});
