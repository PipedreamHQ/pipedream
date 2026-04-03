import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job-contact",
  name: "Get Job Contact",
  description: "Get a job contact by UUID. [See the documentation](https://developer.servicem8.com/reference/getjobcontacts)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      label: "Job contact",
      description: "Select the job contact to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "jobcontact",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "jobcontact",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Contact ${this.uuid}`);
    return response;
  },
};
