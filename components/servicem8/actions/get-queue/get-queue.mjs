import app from "../../servicem8.app.mjs";
import { uuidProp } from "../common/props.mjs";

export default {
  key: "servicem8-get-queue",
  name: "Get Queue",
  description: `Retrieve a Queue by UUID. [See the documentation](https://developer.servicem8.com/reference/listqueues)`,
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
      resource: "queue",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Queue ${this.uuid}`);
    return response;
  },
};
