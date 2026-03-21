import app from "../../servicem8.app.mjs";
import { uuidProp } from "../common/props.mjs";

export default {
  key: "servicem8-get-feedback",
  name: "Get Feedback",
  description: "Retrieve a Feedback by UUID. [See the documentation](https://developer.servicem8.com/reference/listfeedback)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8: app,
    ...uuidProp,
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "feedback",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Feedback ${this.uuid}`);
    return response;
  },
};
