import { defineAction } from "@pipedream/types";
import { CreatePickupTaskParams } from "../../common/requestParams";
import tookan from "../../app/tookan.app";
import common from "../common";

export default defineAction({
  ...common,
  name: "Create Pickup Task",
  description:
    "Create a pickup task [See docs here](https://tookanapi.docs.apiary.io/#reference/task/create-task/create-a-pickup-task)",
  key: "tookan-create-pickup-task",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    jobPickupAddress: {
      propDefinition: [tookan, "jobPickupAddress"],
    },
    jobPickupDatetime: {
      propDefinition: [tookan, "jobPickupDatetime"],
    },
  },
  async run({ $ }) {
    const params: CreatePickupTaskParams = {
      $,
      data: {
        additionalOptions: this.additionalOptions,
        timezone: this.timezone,
        job_pickup_address: this.jobPickupAddress,
        job_pickup_datetime: this.jobPickupDatetime,
        has_delivery: 0,
        has_pickup: 1,
        layout_type: 0
      },
    };
    const data = await this.tookan.createPickupTask(params);

    $.export("$summary", "Created pickup task successfully");

    return data;
  },
});
