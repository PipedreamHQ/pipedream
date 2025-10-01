import {
  PROBE_FILTERS_OPTIONS,
  RESOLUTION_OPTIONS,
} from "../../common/constants.mjs";
import { removeHttp } from "../../common/utils.mjs";
import pingdom from "../../pingdom.app.mjs";

export default {
  key: "pingdom-create-http-check",
  name: "Create HTTP Check",
  description: "Creates a new HTTP check in Pingdom. [See the documentation](https://docs.pingdom.com/api/#tag/Checks/operation/post.checks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pingdom,
    host: {
      type: "string",
      label: "Host",
      description: "The target host for the check.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the check.",
    },
    auth: {
      type: "string",
      label: "Auth",
      description: "Username and password, colon separated.",
      optional: true,
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "Custom message that will be added to email and webhook alerts.",
      optional: true,
    },
    integrationIds: {
      type: "integer[]",
      label: "Integration Ids",
      description: "Integration identifiers.",
      optional: true,
    },
    ipv6: {
      type: "boolean",
      label: "IPV6",
      description: "Use ipv6 instead of ipv4, if an IP address is provided as host this will be overrided by the IP address version.",
      optional: true,
    },
    notifyAgainEvery: {
      type: "string",
      label: "Notify Again Every",
      description: "Notify again every n result. 0 means that no extra notifications will be sent.",
      optional: true,
    },
    notifyWhenBackup: {
      type: "boolean",
      label: "Notify When Backup",
      description: "Notify when back up again.",
      optional: true,
    },
    paused: {
      type: "boolean",
      label: "Paused",
      description: "Whether the check is paused or not.",
      optional: true,
    },
    probeFilters: {
      type: "string[]",
      label: "Probe Filters",
      description: "Filters used for probe selections. Overwrites previous filters for check. To remove all filters from a check, use an empty value.",
      options: PROBE_FILTERS_OPTIONS,
      optional: true,
    },
    resolution: {
      type: "integer",
      label: "Resolution",
      description: "How often should the check be tested? (minutes).",
      options: RESOLUTION_OPTIONS,
      optional: true,
    },
    responseTimeThreshold: {
      type: "integer",
      label: "Responsetime Threshold",
      description: "Triggers a down alert if the response time exceeds threshold specified in ms (Not available for Starter and Free plans).",
      optional: true,
    },
    sendNotificationWhenDown: {
      type: "integer",
      label: "Send Notification When Down",
      description: "Send notification when down X times.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags for check. The maximum length of a tag is 64 characters.",
      optional: true,
    },
    teamIds: {
      propDefinition: [
        pingdom,
        "teamIds",
      ],
      optional: true,
    },
    userIds: {
      propDefinition: [
        pingdom,
        "userIds",
      ],
      optional: true,
    },
    encryption: {
      type: "boolean",
      label: "Encryption",
      description: "Connection encryption.",
      optional: true,
    },
    port: {
      type: "integer",
      label: "Port",
      description: "Target port.",
      optional: true,
    },
    sslDownDaysBefore: {
      type: "string",
      label: "SSL Down Days Before",
      description: "Treat the target site as down if a certificate expires within the given number of days. This parameter will be ignored if `verify_certificate` is set to `false`. It will appear provided `verify_certificate` is true and `ssl_down_days_before` value is greater than or equals 1.",
      optional: true,
    },
    verifyCertificate: {
      type: "boolean",
      label: "Verify Certificate",
      description: "Treat target site as down if an invalid/unverifiable certificate is found.",
      optional: true,
    },
    postData: {
      type: "string",
      label: "Post Data",
      description: "Data that should be posted to the web page, for example submission data for a sign-up or login form. The data needs to be formatted in the same way as a web browser would send it to the web server.",
      optional: true,
    },
    requestHeaders: {
      type: "string[]",
      label: "Request Headers",
      description: "Custom HTTP header.",
      optional: true,
    },
    shouldContain: {
      type: "string",
      label: "Should Contain",
      description: "Target site should contain this string. Note! This parameter cannot be used together with the parameter 'shouldnotcontain', use only one of them in your request.",
      optional: true,
    },
    shouldNotContain: {
      type: "string",
      label: "Should Not Contain",
      description: "Target site should NOT contain this string. Note! This parameter cannot be used together with the parameter 'shouldcontain', use only one of them in your request.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "Path to target on server.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      pingdom,
      host,
      customMessage,
      notifyAgainEvery,
      probeFilters,
      responseTimeThreshold,
      sslDownDaysBefore,
      verifyCertificate,
      integrationIds,
      notifyWhenBackup,
      sendNotificationWhenDown,
      teamIds,
      userIds,
      postData,
      requestHeaders,
      shouldContain,
      shouldNotContain,
      ...data
    } = this;

    const response = await pingdom.createCheck({
      data: {
        type: "http",
        host: removeHttp(host),
        custom_message: customMessage,
        integrationids: integrationIds,
        notifyagainevery: notifyAgainEvery && parseInt(notifyAgainEvery),
        notifywhenbackup: notifyWhenBackup,
        probe_filters: probeFilters && probeFilters.map((item) => `region:${item}`),
        sendnotificationwhendown: sendNotificationWhenDown,
        teamids: teamIds,
        userids: userIds,
        responsetime_threshold: responseTimeThreshold,
        postdata: postData,
        requestheaders: requestHeaders,
        shouldcontain: shouldContain,
        shouldnotcontain: shouldNotContain,
        ssl_down_days_before: sslDownDaysBefore && parseInt(sslDownDaysBefore),
        verify_certificate: verifyCertificate,
        ...data,
      },
    });

    $.export("$summary", `Successfully created HTTP check with name "${this.name}"`);
    return response;
  },
};
