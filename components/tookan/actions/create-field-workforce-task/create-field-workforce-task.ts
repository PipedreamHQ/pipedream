import { defineAction } from "@pipedream/types";
import { CreateFieldWorkforceTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";
import { TaskData } from "../../common/responseSchemas";

export default defineAction({
  ...common,
  name: "Create Field Workforce Task",
  description:
    "Create a field workforce task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-a-field-workforce-task)",
  key: "tookan-create-field-workforce-task",
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
        timezone: this.timezone,
        customer_address: this.customerAddress,
        job_delivery_datetime: this.jobDeliveryDatetime,
        job_pickup_datetime: this.jobPickupDatetime,
        has_delivery: 0,
        has_pickup: 0,
        layout_type: 2,
        ...this.additionalOptions,
      },
    };
    const data: TaskData = await this.tookan.createFieldWorkforceTask(params);

    $.export("$summary", `Created field workforce task successfully (id ${data.job_id})`);

    return data;
  },
});
