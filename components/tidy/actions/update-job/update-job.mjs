import tidy from "../../tidy.app.mjs";

export default {
  key: "tidy-update-job",
  name: "Update Job",
  description: "Updaets a job in Tidy. [See the documentation](https://help.tidy.com/update-a-job)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tidy,
    jobId: {
      propDefinition: [
        tidy,
        "jobId",
      ],
    },
    startNoEarlierThanDate: {
      type: "string",
      label: "Start No Earlier Than Date",
      description: "First date a job can be scheduled to start. Formatted like `YYYY-MM-DD`.",
      optional: true,
    },
    startNoEarlierThanTime: {
      type: "string",
      label: "Start No Earlier Than Time",
      description: "First time a job can be scheduled to start. Formatted `HH:MM`.",
      optional: true,
    },
    endNoLaterThanDate: {
      type: "string",
      label: "End No Later Than Date",
      description: "Latest date a Job can be scheduled to finish. Formatted like `YYYY-MM-DD`.",
      optional: true,
    },
    endNoLaterThanTime: {
      type: "string",
      label: "End No Later Than Time",
      description: "Latest time a Job can be scheduled to finish Formatted `HH:MM`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const startNoEarlierThan = (this.startNoEarlierThanDate || this.startNoEarlierThanTime)
      ? {
        date: this.startNoEarlierThanDate || undefined,
        time: this.startNoEarlierThanTime || undefined,
      }
      : undefined;
    const endNoLaterThan = (this.endNoLaterThanDate || this.endNoLaterThanTime)
      ? {
        date: this.endNoLaterThanDate || undefined,
        time: this.endNoLaterThanTime || undefined,
      }
      : undefined;

    const response = await this.tidy.updateJob({
      jobId: this.jobId,
      data: {
        start_no_earlier_than: startNoEarlierThan,
        end_no_later_than: endNoLaterThan,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated job with ID ${this.jobId}.`);
    }

    return response;
  },
};
