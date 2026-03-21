import app from "../../servicem8.app.mjs";
import { uuidProp } from "../common/props.mjs";

export default {
  key: "servicem8-get-company-contact",
  name: "Get Company Contact",
  description: "Retrieve a Company Contact by UUID. [See the documentation](https://developer.servicem8.com/reference/listcompanycontacts)",
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
      resource: "companycontact",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Company Contact ${this.uuid}`);
    return response;
  },
};
