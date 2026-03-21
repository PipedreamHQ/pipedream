import app from "../../servicem8.app.mjs";
import { uuidProp } from "../common/props.mjs";

export default {
  key: "servicem8-get-category",
  name: "Get Category",
  description: "Retrieve a Category by UUID. [See the documentation](https://developer.servicem8.com/reference/listcategories)",
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
      resource: "category",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Category ${this.uuid}`);
    return response;
  },
};
