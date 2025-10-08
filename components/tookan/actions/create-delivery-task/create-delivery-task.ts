import { defineAction } from "@pipedream/types";
import { CreateDeliveryTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";
import { TaskData } from "../../common/responseSchemas";

export default defineAction({
  ...common,
  name: "Create Delivery Task",
  description:
    "Create a delivery task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-a-delivery-task)",
  key: "tookan-create-delivery-task",
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
  },
  async run({ $ }) {
    const params: CreateDeliveryTaskParams = {
      $,
      data: {
        timezone: this.timezone,
        customer_address: this.customerAddress,
        job_delivery_datetime: this.jobDeliveryDatetime,
        has_delivery: 1,
        has_pickup: 0,
        layout_type: 0,
        ...this.additionalOptions,
      },
    };
    const data: TaskData = await this.tookan.createDeliveryTask(params);

    $.export("$summary", `Created delivery task successfully (id ${data.job_id})`);

    return data;
  },
});
