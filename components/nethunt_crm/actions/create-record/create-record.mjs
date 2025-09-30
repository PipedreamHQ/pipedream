import nethuntCrm from "../../nethunt_crm.app.mjs";

export default {
  key: "nethunt_crm-create-record",
  name: "Create Record",
  description: "Creates a new record. [See docs here](https://nethunt.com/integration-api#create-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nethuntCrm,
    folderId: {
      propDefinition: [
        nethuntCrm,
        "folderId",
      ],
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The user time zone. Refer to the Timezone database name [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)",
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "The name and values to set on the record. You can use Get Record action to get a record of the same record type to know which fields are available.",
    },
  },
  async run({ $ }) {
    const fields = typeof this.fields === "string"
      ? JSON.parse(this.fields)
      : this.fields;

    const response = await this.nethuntCrm.createRecord({
      folderId: this.folderId,
      data: {
        timeZone: this.timeZone,
        fields,
      },
    });

    $.export("$summary", "Successfully created record");

    return response;
  },
};
