const fields = {
  fixedProxyAlias: "fixed_proxy_alias",
  disableJS: "disable_js",
  pageHeight: "page_height",
  targetDevice: "target_device",
  waitTime: "wait_time",
  multicheckEnabled: "multicheck_enabled",
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
    job.preactions.active = preactionsActive;
  }
  if (preactionsObjects) {
    job.preactions.actions = preactionsObjects;
  }
  if (stopTime && startTime && activeDays) {
    job.advanced_schedule.stop_time = stopTime;
    job.advanced_schedule.start_time = startTime;
    job.advanced_schedule.active_dyas = activeDays;
  }
  if (enableSmsAlert != undefined) {
    job.notification.enableSmsAlert = enableSmsAlert;
  }
  if (enableEmailAlert != undefined) {
    job.notification.enableEmailAlert = enableEmailAlert;
  }
  if (useSlackNotification != undefined) {
    job.notification.slack = {
      url: slackUrl,
      active: true,
      channels: slackChannels,
    };
  }
  if (useTeamsNotification != undefined) {
    job.notification.teams = {
      url: teamsUrl,
      active: true,
    };
  }
  if (useWebhookNotification != undefined) {
    job.notification.webhook = {
      url: webhookUrl,
      active: true,
    };
  }
  if (useDiscordNotification != undefined) {
    job.notification.discord = {
      url: discordUrl,
      active: true,
    };
  }
  if (useSlackAppNotification != undefined) {
    job.notification.slack_app = {
      url: slackAppUrl,
      active: true,
      channels: slackAppChannels,
    };
  }
  if ([
    "1",
    "3",
  ].includes(targetDevice)) {
    if (cropX && cropY && cropWidth && cropHeight) {
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

