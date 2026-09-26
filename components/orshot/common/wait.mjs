import { ConfigurationError } from "@pipedream/platform";

// How long the first pause waits for Orshot's webhook before falling back to
// polling. Orshot renders have a 15 minute ceiling, so 16 minutes covers every
// render that can still succeed.
export const WEBHOOK_WAIT_MS = 16 * 60 * 1000;
// Polling fallback cadence and cap (only used if the webhook never arrives).
export const POLL_INTERVAL_MS = 30 * 1000;
export const MAX_POLLS = 20;
// Total reruns Pipedream may perform for this step: 1 webhook wake-up + polls.
export const MAX_RERUNS = 1 + MAX_POLLS;
// How many recent jobs to scan when the webhook never arrived and we have to
// find our job by its metadata tag.
export const JOB_LOOKUP_LIMIT = 100;

const parseBody = (body) => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body || {};
};

/**
 * Pull the job object out of an Orshot `render_job.finished` webhook that
 * Pipedream captured in `$.context.run.callback_request`.
 */
export const jobFromCallback = (callbackRequest) => {
  if (!callbackRequest) {
    return null;
  }
  const body = parseBody(callbackRequest.body ?? callbackRequest);
  return body?.job && body.job.id !== undefined
    ? body.job
    : null;
};

export const assertFlowControl = ($) => {
  if (!$?.flow?.rerun || !$?.context?.run) {
    throw new ConfigurationError("`Wait For Completion` needs Pipedream's `$.flow.rerun`, which is only available when this action runs inside a deployed workflow. Turn it off and use **Start Async Render** + **Get Render Job** instead.");
  }
};

export const makeNonce = () =>
  `pipedream-${Date.now().toString(36)}-${Math.random().toString(36)
    .slice(2, 10)}`;

/**
 * Drive an async render to completion with Pipedream's $.flow.rerun:
 *  run 1  → register a rerun (its resume_url becomes Orshot's webhook_url),
 *           start the async render tagged with a nonce in `metadata`.
 *  run 2+ → woken by the webhook (callback_request) or by the timer.
 *           Webhook: use the job it carried. Timer: find the job by nonce,
 *           then poll GET /studio/render-jobs/:id until it finishes.
 * Resolves to the finished job, or `null` while the step is still waiting.
 */
export const waitForRender = async ({
  $, app, body,
}) => {
  assertFlowControl($);
  const { run } = $.context;
  const ctx = run.context || {};

  if (run.runs === 1) {
    const nonce = makeNonce();
    const { resume_url: resumeUrl } = $.flow.rerun(WEBHOOK_WAIT_MS, {
      nonce,
      polls: 0,
    }, MAX_RERUNS);
    const job = await app.generateImageFromStudioTemplate({
      $,
      data: {
        ...body,
        response: {
          ...body.response,
          mode: "async",
        },
        webhook_url: resumeUrl,
        metadata: nonce,
      },
    });
    $.export("$summary", `Started async render job ${job?.id}; waiting for it to finish`);
    $.export("job", job);
    return null;
  }

  let job = jobFromCallback(run.callback_request);
  let jobId = job?.id ?? ctx.jobId;

  if (!job?.finished) {
    if (jobId === undefined) {
      const { data = [] } = await app.listRenderJobs({
        $,
        params: {
          limit: JOB_LOOKUP_LIMIT,
        },
      });
      const match = data.find((j) => j.metadata === ctx.nonce);
      jobId = match?.id;
    }
    if (jobId === undefined) {
      throw new Error("Could not find the async render job started by this step. It may have failed to start; check your Orshot render jobs.");
    }
    job = await app.getRenderJob({
      $,
      jobId,
    });
  }

  if (job?.finished) {
    return job;
  }

  const polls = (ctx.polls || 0) + 1;
  if (polls > MAX_POLLS) {
    throw new Error(`Render job ${jobId} is still ${job?.status} after the polling limit. Use **Get Render Job** to check it later.`);
  }
  $.flow.rerun(POLL_INTERVAL_MS, {
    nonce: ctx.nonce,
    jobId,
    polls,
  }, MAX_RERUNS);
  $.export("$summary", `Render job ${jobId} is ${job?.status}; checking again in ${POLL_INTERVAL_MS / 1000}s`);
  return null;
};
