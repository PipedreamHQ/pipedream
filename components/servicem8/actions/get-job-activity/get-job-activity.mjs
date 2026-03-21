import app from "../../servicem8.app.mjs";
import { uuidProp } from "../common/props.mjs";

export default {
  key: "servicem8-get-job-activity",
  name: "Get Job Activity",
  description: `Retrieve a Job Activity by UUID. [See the documentation](https://developer.servicem8.com/reference/listjobactivities)`,
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
      resource: "jobactivity",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Activity ${this.uuid}`);
    return response;
  },
};
