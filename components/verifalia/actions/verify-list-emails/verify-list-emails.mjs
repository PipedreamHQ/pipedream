import { axios } from "@pipedream/platform";
import verifalia from "../../verifalia.app.mjs";
import common from "../../common.mjs";

import {
  CancellationToken,
  OperationCanceledError,
} from "verifalia";

export default {
  name: "Verify List of Email Address",
  description: "Verify a list of email address and check if it is properly formatted, really exists and can accept mails, " +
    "flagging spam traps, disposable emails and much more. [See the docs](https://verifalia.com/developers#email-validations-creating) for more information",
  key: "verifalia-verify-list-emails",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    verifalia,
    emailAddresses: {
      type: "string[]",
      label: "Email Addresses",
      description: "Enter a list of email address to verify (e.g. `batman@gmail.com`)",
      optional: false,
    },
    quality: {
      type: "string",
      label: "Quality Level",
      description: "The higher the quality level the longer it could take to complete the verification; by default, we use the configured default quality level for your Verifalia user.",
      optional: true,
      options: common.qualityLevelOptions,
    },
    retention: {
      type: "string",
      label: "Data Retention Period",
      description: "The data retention period to observe for the validation job, expressed in the format `dd.hh:mm:ss` " +
        "(where dd: days, hh: hours, mm: minutes, ss: seconds); the initial `dd.` part is added only for periods of " +
        "more than 24 hours. The value has a minimum of 5 minutes (`0:5:0`) and a maximum of 30 days (`30.0:0:0`): " +
        "Verifalia will delete the job and its data once its data retention period is over, starting to count when " +
        "it gets completed.",
      optional: true,
    },
  },

  async run({ $ }) {
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };
    const verifaliaClient = this.verifalia.buildVerifaliaRestClient();

    // This component takes advantage of the new Pipedream's flow suspension: we handle
    // the first run vs. callback scenarios hereafter.

    if (run.runs === 1) {
      // Check the format of the data retention period and report a user-friendly error

      if (this.retention && !this.verifalia.isValidTimeSpan(this.retention)) {
        throw new Error(`The specified data retention period '${this.retention}' is incorrect: must be in the ` +
          "format dd.hh:mm:ss (where dd: days, hh: hours, mm: minutes, ss: seconds).");
      }

      // HACK: Pausing a workflow is not supported in test mode, as the editor would just
      // output the message "Would have paused until...". To overcome this, we are *not*
      // suspending runs in test mode and, in that case, proceed with a standard polling
      // to the API, backed by the usual Promise support. If the execution time approaches
      // the one we are allowed by Pipedream, we just let the user know.

      let resumeUrl = null;
      let waitForResults = false;
      let cancellationToken = null;

      if (context && $.context.test) {
        // In test mode, we will wait for the verification results during this execution
        // and cancel the token after 20s (the actual lowest limit is 30s).
        // See: https://pipedream.com/docs/limits/#time-per-execution

        waitForResults = true;
        cancellationToken = new CancellationToken();
        setTimeout(() => cancellationToken.cancel(), 20 * 1000);
      } else {
        // In deployment mode, we won't wait for the verification results during this
        // execution and, instead, rely on the Verifalia completion callback support and
        // on the Pipedream's new ability to suspend execution flows.

        resumeUrl = $.flow.rerun(86400 * 1000, {}, 1).resume_url;
      }

      // Submit the verification to Verifalia

      let job;

      try {
        const parsedEmails = !Array.isArray(this.emailAddresses)
          ? JSON.parse(this.emailAddresses)
          : this.emailAddresses;

        const formattedEmails = parsedEmails.map((emailAddress) => ({
          inputData: emailAddress,
        }));

        job = await this.verifalia.wrapVerifaliaApiInvocation(async () => {
          return await verifaliaClient
            .emailValidations
            .submit({
              quality: this.quality,
              entries: formattedEmails,
              retention: this.retention,
              callback: {
                url: resumeUrl,
              },
            },
            waitForResults,
            cancellationToken);
        });
      } catch (error) {
        // If the error is an OperationCanceledError it means that we are in test mode and
        // have manually cancelled the submission: just let the user know why that happened.

        if (error instanceof OperationCanceledError) {
          // Had to replace the word req*ire with a synonym because of https://github.com/PipedreamHQ/pipedream/issues/3187 :)

          throw new Error("This operation would need some more time to complete and that would not work properly in " +
            "Pipedream's test mode. Please deploy your workflow to get a meaningful email verification result.");
        }

        throw error;
      }

      // Handle the verification outcome, if available

      if (job.overview.status === "Completed") {
        if (!resumeUrl) {
          // We are in test mode and the validation just completed in a single request

          return job;
        }

        // TODO: If the validation completed, abort the suspension and return the results
        // Blocked by https://github.com/PipedreamHQ/pipedream/issues/3151

        // We are *not* in test mode and the job is complete: simulate an instantaneous
        // webhook completion callback, as the external one may take a few seconds to
        // fire and we wish to continue the flow as fast as possible.

        return axios($, {
          method: "POST",
          url: resumeUrl,
          data: {
            event: {
              type: "email-validation.completed",
              data: {
                id: job.overview.id,
              },
            },
          },
          returnFullResponse: true,
        });
      }

      // If we are here, the validation is not yet completed and the flow is going to
      // be suspended by Pipedream.
    } else {
      const callbackRequest = run.callback_request;

      // We are only interested in a specific callback type

      if (callbackRequest.body.event.type === "email-validation.completed") {
        // Retrieve and return the job

        const jobId = callbackRequest.body.event.data.id;

        return await this.verifalia.wrapVerifaliaApiInvocation(() => verifaliaClient
          .emailValidations
          .get(jobId));
      }

      // We have just received a callback we weren't waiting for :/

      console.log(callbackRequest);
      throw new Error("An error occurred while processing your request, sorry.");
    }
  },
};
