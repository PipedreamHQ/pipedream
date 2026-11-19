import klussenbeheer from "../../klussenbeheer.app.mjs";

export default {
  key: "klussenbeheer-get-job",
  name: "Get Job",
  description: "Get the full details of a job, including its contact, notes, timeline and quotes. [See the documentation](https://samdesk.nl/klussenbeheer/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const job = await this.klussenbeheer.getJob($, this.jobId);

    $.export("$summary", `Fetched job #${job.id ?? this.jobId}`);

    return job;
  },
};
