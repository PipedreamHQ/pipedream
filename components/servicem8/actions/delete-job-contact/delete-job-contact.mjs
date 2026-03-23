import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-job-contact",
  name: "Delete Job Contact",
  description: "Delete a job contact by UUID. [See the documentation](https://developer.servicem8.com/reference/deletejobcontacts)",
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
        "jobcontactUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "jobcontact",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Job Contact ${this.uuid}`);
    return response;
  },
};
