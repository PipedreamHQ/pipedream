import app from "../../servicem8.app.mjs";
import { uuidProp } from "../common/props.mjs";

export default {
  key: "servicem8-delete-job",
  name: "Delete Job",
  description: "Delete a Job by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...uuidProp,
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "job",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Job ${this.uuid}`);
    return response;
  },
};
