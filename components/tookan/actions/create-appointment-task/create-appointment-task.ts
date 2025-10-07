import { defineAction } from "@pipedream/types";
import { CreateAppointmentTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";
import { TaskData } from "../../common/responseSchemas";

export default defineAction({
  ...common,
  name: "Create Appointment Task",
  description:
    "Create an appointment task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-an-appointment-task)",
  key: "tookan-create-appointment-task",
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
    const params: CreateAppointmentTaskParams = {
      $,
      data: {
        timezone: this.timezone,
        customer_address: this.customerAddress,
        job_delivery_datetime: this.jobDeliveryDatetime,
        job_pickup_datetime: this.jobPickupDatetime,
        has_delivery: 0,
        has_pickup: 0,
        layout_type: 1,
        ...this.additionalOptions,
      },
    };
    const data: TaskData = await this.tookan.createAppointmentTask(params);

    $.export("$summary", `Created appointment task successfully (id ${data.job_id})`);

    return data;
  },
});
