import samsara from "../../samsara.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "samsara-new-route-job-completion-instant",
  name: "New Route Job Completion (Instant)",
  description: "Emits an event when a job is completed on a Samsara route.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    samsara,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    routeName: {
      propDefinition: [
        samsara,
        "routeName",
      ],
    },
    jobReference: {
      propDefinition: [
        samsara,
        "jobReference",
        (c) => ({
          routeName: c.routeName,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the 50 most recent completed jobs for the specified route
      const completedJobs = await this.samsara.listCompletedJobsForRoute({
        routeName: this.routeName,
        jobReference: this.jobReference,
        limit: 50,
      });

      for (const job of completedJobs) {
        this.$emit(job, {
          id: job.id,
          summary: `Job ${job.id} completed on route ${this.routeName}`,
          ts: Date.parse(job.completionTime),
        });
      }
    },
    async activate() {
      // Placeholder for webhook subscription activation logic
      // Replace with actual activation steps if necessary
      const webhookId = "example-webhook-id"; // This should be the result of the webhook creation API call
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        // Placeholder for webhook subscription deactivation logic
        // Replace with actual deactivation steps if necessary
        console.log(`Webhook with ID ${webhookId} deleted`);
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const { body } = event;

    // Assuming the body contains the job completion details
    if (body && body.jobStatus === "Completed") {
      this.$emit(body, {
        id: body.id,
        summary: `Job ${body.id} completed on route ${body.routeName}`,
        ts: Date.parse(body.completionTime) || Date.now(),
      });
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
