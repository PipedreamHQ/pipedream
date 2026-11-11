const fields = {
  fixedProxyAlias: "fixed_proxy_alias",
  disableJS: "disable_js",
  pageHeight: "page_height",
  targetDevice: "target_device",
  waitTime: "wait_time",
  multicheckEnabled: "multicheck_enabled",
  proxyId: "proxy_id",
  keywordAction: "keyword_action",
};

// Matches `GET /v2/jobs/{jobId}` (get-job's single-job shape): `active` and
// `target_device` are real top-level fields there, confirmed live.
export const DEFAULT_JOB_FIELDS = [
  "id",
  "url",
  "description",
  "mode",
  "active",
  "interval",
  "trigger",
  "target_device",
  "workspaceId",
];

// Matches `GET /v2/jobs` (find-jobs's paginated list shape) instead — a
// structurally different response: `isActive` not `active`, no `target_device`
// at all. Confirmed against the live JobListResponseJob schema and eval output.
export const DEFAULT_FIND_JOBS_FIELDS = [
  "id",
  "url",
  "description",
  "mode",
  "isActive",
  "interval",
  "trigger",
  "workspaceId",
];

export const pluckFields = (job, names) => Object.fromEntries(
  [
    "id",
    ...names,
  ].filter((key) => key in job).map((key) => [
    key,
    job[key],
  ]),
);

// The API never returns a top-level `trigger` field — the change-detection
// percent set via `trigger` on create/update only comes back nested under
// `notification.threshold.<mode>`, mirrored at a top-level field alongside it.
// That mirror field's name differs by endpoint: `GET /v2/jobs/{jobId}` (get-job)
// returns `notification_threshold`, `GET /v2/jobs` (find-jobs, paginated list)
// returns `notificationThreshold` — confirmed live, both used here.
// Mirror whichever is present back to `trigger` so read tools can round-trip
// what was written regardless of which endpoint fetched the job.
export const normalizeJob = (job) => {
  if (job && typeof job === "object" && !("trigger" in job)) {
    if ("notification_threshold" in job) {
      job.trigger = job.notification_threshold;
    } else if ("notificationThreshold" in job) {
      job.trigger = job.notificationThreshold;
    }
  }
  return job;
};

export const prepareData = (job, {
  preactionsActive,
  preactionsObjects,
  startTime,
  stopTime,
  activeDays,
  enableSmsAlert,
  enableEmailAlert,
  useSlackNotification,
  slackUrl,
  slackChannels,
  useTeamsNotification,
  teamsUrl,
  useWebhookNotification,
  webhookUrl,
  useDiscordNotification,
  discordUrl,
  useSlackAppNotification,
  slackAppUrl,
  slackAppChannels,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  targetDevice,
  keywords,
  ...data
}) => {
  Object.entries(data).forEach((entry) => {
    const [
      key,
      value,
    ] = entry;
    job[fields[key] || key] = value;
  });
  if (preactionsActive != undefined) {
    job.preactions ??= {};
    job.preactions.active = preactionsActive;
  }
  if (preactionsObjects) {
    job.preactions ??= {};
    job.preactions.actions = preactionsObjects;
  }
  if (stopTime != undefined && startTime != undefined && activeDays) {
    job.advanced_schedule ??= {};
    job.advanced_schedule.stop_time = stopTime;
    job.advanced_schedule.start_time = startTime;
    job.advanced_schedule.active_days = activeDays?.map(Number);
  }
  if (enableSmsAlert != undefined) {
    job.notification.enableSmsAlert = enableSmsAlert;
  }
  if (enableEmailAlert != undefined) {
    job.notification.enableEmailAlert = enableEmailAlert;
  }
  job.notification.configuration ??= {};
  if (useSlackNotification != undefined) {
    job.notification.configuration.slack = {
      ...job.notification.configuration.slack,
      active: useSlackNotification,
      ...(slackUrl != undefined && {
        url: slackUrl,
      }),
      ...(slackChannels != undefined && {
        channels: slackChannels,
      }),
    };
  }
  if (useTeamsNotification != undefined) {
    job.notification.configuration.teams = {
      ...job.notification.configuration.teams,
      active: useTeamsNotification,
      ...(teamsUrl != undefined && {
        url: teamsUrl,
      }),
    };
  }
  if (useWebhookNotification != undefined) {
    job.notification.configuration.webhook = {
      ...job.notification.configuration.webhook,
      active: useWebhookNotification,
      ...(webhookUrl != undefined && {
        url: webhookUrl,
      }),
    };
  }
  if (useDiscordNotification != undefined) {
    job.notification.configuration.discord = {
      ...job.notification.configuration.discord,
      active: useDiscordNotification,
      ...(discordUrl != undefined && {
        url: discordUrl,
      }),
    };
  }
  if (useSlackAppNotification != undefined) {
    job.notification.configuration.slack_app = {
      ...job.notification.configuration.slack_app,
      active: useSlackAppNotification,
      ...(slackAppUrl != undefined && {
        url: slackAppUrl,
      }),
      ...(slackAppChannels != undefined && {
        channels: slackAppChannels,
      }),
    };
  }
  if (targetDevice != undefined) {
    job.target_device = targetDevice;
  }
  if (keywords != undefined) {
    job.keywords = keywords.toString();
  }
  if ([
    "1",
    "3",
  ].includes(targetDevice)) {
    const hasCrop = cropX != undefined && cropY != undefined
      && cropWidth != undefined && cropHeight != undefined;
    if (hasCrop) {
      job.crop = {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
      };
    }
  }
  job.interval = `${job.interval}`;
  delete job.id;
  return job;
};

