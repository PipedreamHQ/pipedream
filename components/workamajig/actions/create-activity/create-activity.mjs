import workamajig from "../../workamajig.app.mjs";

export default {
  key: "workamajig-create-activity",
  name: "Create Activity",
  description: "Initiates the creation of a fresh activity in Workamajig. [See the documentation](https://app6.workamajig.com/platinum/?aid=common.apidocs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    workamajig,
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the new activity",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the activity",
      optional: true,
    },
    companyKey: {
      propDefinition: [
        workamajig,
        "companyKey",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const activity = await this.workamajig.createActivity({
      data: {
        subject: this.subject,
        notes: this.notes,
        contactCompanyKey: this.companyKey,
      },
      $,
    });

    $.export("$summary", `Successfully created activity "${this.subject}".`);
    return activity;
  },
};
