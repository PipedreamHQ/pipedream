import app from "../../servicem8.app.mjs";
import {
  uuidProp, recordProp,
} from "../common/props.mjs";

export default {
  key: "servicem8-update-job-payment",
  name: "Update Job Payment",
  description: "Update an existing Job Payment. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...uuidProp,
    ...recordProp,
  },
  async run({ $ }) {
    const response = await this.servicem8.updateResource({
      $,
      resource: "jobpayment",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Job Payment ${this.uuid}`);
    return response;
  },
};
