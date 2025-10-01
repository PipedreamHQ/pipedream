import nethuntCrm from "../../nethunt_crm.app.mjs";

export default {
  key: "nethunt_crm-get-record",
  name: "Get Record",
  description: "Retrieve a record by its ID. [See docs here](https://nethunt.com/integration-api#find-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    recordId: {
      propDefinition: [
        nethuntCrm,
        "recordId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nethuntCrm.findRecordById({
      folderId: this.folderId,
      recordId: this.recordId,
    });

    $.export("$summary", response.length
      ? "Successfully retrieved record"
      : "Record not found");

    return response;
  },
};
