import klussenbeheer from "../../klussenbeheer.app.mjs";

export default {
  key: "klussenbeheer-add-job-note",
  name: "Add Job Note",
  description: "Add a private note to a job. Nothing is sent to the customer. [See the documentation](https://samdesk.nl/klussenbeheer/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    klussenbeheer,
    jobId: {
      propDefinition: [
        klussenbeheer,
        "jobId",
      ],
    },
    note: {
      propDefinition: [
        klussenbeheer,
        "note",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.klussenbeheer.addJobNote($, this.jobId, this.note);

    $.export("$summary", `Note added to job #${this.jobId}`);

    return response;
  },
};
