import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-staff",
  name: "Delete Staff",
  description: "Delete a staff member by UUID. [See the documentation](https://developer.servicem8.com/reference/deletestaffmembers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    uuid: {
      propDefinition: [
        app,
        "staffUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "staff",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Staff ${this.uuid}`);
    return response;
  },
};
