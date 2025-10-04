import { ConfigurationError } from "@pipedream/platform";
import app from "../../contactout.app.mjs";

export default {
  key: "contactout-verify-email-bulk",
  name: "Verify Email Bulk",
  description: "Verify the deliverability for a batch of up to 1000 email addresses in bulk. [See the documentation](https://api.contactout.com/#bulk).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    emails: {
      propDefinition: [
        app,
        "emails",
      ],
      description: "Array of email addresses to verify (max 1000)",
    },
    callbackUrl: {
      propDefinition: [
        app,
        "callbackUrl",
      ],
      description: "A URL where the results will be posted once the bulk email verification operation is completed",
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "If set to `true`, the action will wait and poll until the bulk verification job is `DONE`. If set to `false`, it will return immediately after creating the job. Not available in Pipedream Connect.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      emails,
      callbackUrl,
      waitForCompletion,
    } = this;

    const MAX_RETRIES = 15;
    const DELAY = 1000 * 15; // 15 seconds
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };

    // First run: Create the bulk verification job
    if (run.runs === 1) {
      const response = await app.verifyEmailBulk({
        $,
        data: {
          emails,
          callback_url: callbackUrl,
        },
      });

      $.export("$summary", `Successfully queued bulk email verification with job ID \`${response.job_id}\`.`);

      // If user doesn't want to wait, return immediately
      if (!waitForCompletion || !context) {
        return response;
      }

      // Store job_id for polling and start rerun
      $.flow.rerun(DELAY, {
        jobId: response.job_id,
      }, MAX_RETRIES);
      return response;
    }

    // Subsequent runs: Poll for job status
    if (run.runs > MAX_RETRIES) {
      throw new ConfigurationError("Max retries exceeded - bulk verification job may still be running");
    }

    const { jobId } = run.context;

    // Poll for status
    const statusResponse = await app.getBulkVerificationStatus({
      $,
      jobId,
    });

    // If job is completed, return the final status
    if (statusResponse.data?.status === "DONE") {
      $.export("$summary", `Bulk email verification job \`${jobId}\` completed successfully. Verified ${Object.keys(statusResponse.data.result || {}).length} emails.`);
      return statusResponse;
    }

    // If job failed or has an error status, throw error
    if (statusResponse.data?.status === "FAILED" || statusResponse.data?.status === "ERROR") {
      throw new ConfigurationError(`Bulk email verification job \`${jobId}\` failed with status: ${statusResponse.data?.status}`);
    }

    // Otherwise, continue polling
    $.flow.rerun(DELAY, {
      jobId,
    }, MAX_RETRIES);
    return {
      status: statusResponse.data?.status || "PROCESSING",
      jobId,
      message: `Job is still running. Current status: ${statusResponse.data?.status || "PROCESSING"}`,
    };
  },
};
