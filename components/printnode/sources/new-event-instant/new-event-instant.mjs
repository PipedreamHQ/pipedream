import printnode from "../../printnode.app.mjs";

export default {
  key: "printnode-new-event-instant",
  name: "New Event Instant",
  description: "Emit new event when a new printnode event is created. [See the documentation](https://www.printnode.com/en/docs/api/curl)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    printnode,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    printerId: {
      propDefinition: [
        printnode,
        "printerId",
      ],
    },
    documentContent: {
      propDefinition: [
        printnode,
        "documentContent",
      ],
    },
    contentType: {
      propDefinition: [
        printnode,
        "contentType",
      ],
    },
    dateRange: {
      propDefinition: [
        printnode,
        "dateRange",
        (c) => ({
          printerId: c.printerId,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit up to 50 most recent print jobs
      const printJobs = await this.printnode.listPrintJobs({
        dateRange: this.dateRange,
      });
      printJobs.slice(-50).reverse()
        .forEach((job) => {
          this.$emit(job, {
            id: job.id,
            summary: `New print job: ${job.title}`,
            ts: Date.parse(job.createTimestamp),
          });
        });
    },
    async activate() {
      // Normally we would create a webhook subscription here, but since PrintNode
      // doesn't support webhooks, there's nothing to activate.
    },
    async deactivate() {
      // Normally we would delete a webhook subscription here, but since PrintNode
      // doesn't support webhooks, there's nothing to deactivate.
    },
  },
  async run() {
    const lastJobId = this.db.get("lastJobId") || 0;
    const printJobs = await this.printnode.listPrintJobs({
      dateRange: this.dateRange,
    });

    printJobs.forEach((job) => {
      if (job.id > lastJobId) {
        this.$emit(job, {
          id: job.id,
          summary: `New print job: ${job.title}`,
          ts: Date.parse(job.createTimestamp),
        });
      }
    });

    // Update the last processed job ID
    const latestJobId = Math.max(...printJobs.map((job) => job.id), lastJobId);
    this.db.set("lastJobId", latestJobId);

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
