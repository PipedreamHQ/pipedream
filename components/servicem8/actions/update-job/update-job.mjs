import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-job",
  name: "Update Job",
  description: "Update an existing Job. The API uses POST to the job URL; send a complete `record` object with every field you want to keep—partial payloads can clear omitted fields. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    uuid: {
      propDefinition: [
        app,
        "jobUuid",
      ],
    },
    record: {
      propDefinition: [
        app,
        "record",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateResource({
      $,
      resource: "job",
      uuid: this.uuid,
      data: this.record,
    });
    $.export("$summary", `Updated Job ${this.uuid}`);
    return response;
  },
};
