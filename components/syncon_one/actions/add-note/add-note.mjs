import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-add-note",
  name: "Add Note",
  description: "Writes a note on a customer, company, lead or deal.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    record_type: {
      type: "string",
      label: "Record type",
      description: "The record type.",
      options: ["person", "company", "lead", "opportunity"],
    },
    record_id: { type: "string", label: "Record id", description: "The record id." },
    body: { type: "string", label: "Body", description: "The body." },
    pinned: { type: "boolean", label: "Pinned", description: "The pinned.", optional: true },
  },
  async run({ $ }) {
    const data = {};
    for (const key of ["record_type", "record_id", "body", "pinned"]) {
      if (this[key] !== undefined && this[key] !== "") data[key] = this[key];
    }
    const response = await this.syncOne.create({ $, path: "/notes", data });
    $.export("$summary", `Added note ${response.data?.id ?? ""}`);
    return response.data;
  },
};
