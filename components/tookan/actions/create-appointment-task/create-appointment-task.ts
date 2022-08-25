import tookan from "../../app/tookan.app";
import { defineAction } from "@pipedream/types";
import { CreateAppointmentTaskParams } from "../../common/requestParams";

export default defineAction({
  name: "Create Appointment Task",
  description:
    "Create an appointment task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-an-appointment-task)",
  key: "tookan-create-appointment-task",
  version: "0.0.1",
  type: "action",
  props: {
    tookan,
  },
  async run({ $ }) {
    const params: CreateAppointmentTaskParams = {
      $,
      data: {
        additionalOptions: {},
        timezone: 'abc',
        customer_address: 'test',
        job_delivery_datetime: 'test',
        job_pickup_datetime: 'test',
        has_pickup: 0,
        has_delivery: 0,
        layout_type: 1
      },
    };
    const data = await this.tookan.createAppointmentTask(params);

    $.export("$summary", "Created appointment task successfully");

    return data;
  },
});
