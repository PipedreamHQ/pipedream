import app from "../../servicem8.app.mjs";
import { uuidProp } from "../common/props.mjs";

export default {
  key: "servicem8-delete-note",
  name: "Delete Note",
  description: "Delete a Note by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
      resource: "note",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Note ${this.uuid}`);
    return response;
  },
};
