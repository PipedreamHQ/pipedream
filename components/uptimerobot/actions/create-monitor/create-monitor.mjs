import constants from "../../common/constants.mjs";
import app from "../../uptimerobot.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "uptimerobot-create-monitor",
  name: "Create Monitor",
  description: "Create a new monitor. [See the documentation](https://uptimerobot.com/api/).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Monitor Type",
      description: "The type of the monitor.",
      reloadProps: true,
      default: constants.MONITOR_TYPE.PING.value,
      options: Object.values(constants.MONITOR_TYPE),
    },
    friendlyName: {
      description: "A friendly name for the monitor.",
      propDefinition: [
        app,
        "friendlyName",
      ],
    },
    url: {
      type: "string",
      label: "URL, IP Or Host",
      description: "The URL, IP address or Host to monitor.",
    },
    interval: {
      type: "string",
      label: "Monitor Interval",
      description: "The interval for the monitoring check in seconds. It is recommended to use at least 1-minute checks [available in paid plans](https://app.uptimerobot.com/billing/pricing).",
      default: String(5 * 60),
      options: [
        {
          label: "5 Minutes",
          value: String(5 * 60),
        },
        {
          label: "30 Minutes",
          value: String(30 * 60),
        },
        {
          label: "1 Hour",
          value: String(60 * 60),
        },
        {
          label: "12 Hours",
          value: String(12 * 60 * 60),
        },
        {
          label: "1 Day",
          value: String(24 * 60 * 60),
        },
      ],
    },
    alertContacts: {
      type: "string[]",
      label: "Alert Contacts",
      propDefinition: [
        app,
        "alertContact",
      ],
    },
  },
  additionalProps() {
    const {
      type: monitorType,
      subType,
    } = this;

    const timeout = {
      type: "string",
      label: "Request Timeout",
      description: "The request timeout. The shorter the timeout the earlier we mark website as down.",
      default: "30",
      options: [
        {
          label: "1 Second",
          value: "1",
        },
        {
          label: "15 Seconds",
          value: "15",
        },
        {
          label: "30 Seconds",
          value: "30",
        },
        {
          label: "45 Seconds",
          value: "45",
        },
        {
          label: "1 Minute",
          value: "60",
        },
      ],
    };

    const authProps = {
      httpAuthType: {
        type: "string",
        label: "HTTP Auth Type",
        description: "The HTTP auth type for the monitor.",
        optional: true,
        options: [
          {
            label: "HTTP Basic",
            value: "1",
          },
          {
            label: "Digest",
            value: "2",
          },
        ],
      },
      httpUsername: {
        type: "string",
        label: "HTTP Username",
        description: "The HTTP username for the monitor.",
        optional: true,
      },
      httpPassword: {
        type: "string",
        label: "HTTP Password",
        description: "The HTTP password for the monitor.",
        optional: true,
      },
    };

    if (monitorType === constants.MONITOR_TYPE.PORT.value) {
      return {
        timeout,
        subType: {
          type: "string",
          label: "Port Type",
          description: "The type of the port.",
          options: Object.values(constants.PORT_TYPE),
          default: constants.PORT_TYPE.HTTP.value,
          reloadProps: true,
        },
        ...(subType === constants.PORT_TYPE.CUSTOM.value && {
          port: {
            type: "string",
            label: "Port",
            description: "The port number to monitor.",
          },
        }),
      };
    }

    if (monitorType === constants.MONITOR_TYPE.KEYWORD.value) {
      return {
        keywordValue: {
          type: "string",
          label: "Keyword Value",
          description: "The keyword must be present in the response HTML source. You can use HTML markup, too. Eg. `apple` or `<span id=\"availability\">Out of stock</span>`.",
        },
        keywordType: {
          type: "string",
          label: "Keyword Type",
          description: "The keyword type of the monitor.",
          default: "1",
          options: [
            {
              label: "Start incident when keyword exists",
              value: "1",
            },
            {
              label: "Start incident when keyword does not exist",
              value: "2",
            },
          ],
        },
        keywordCaseType: {
          type: "string",
          label: "Keyword Case Type",
          description: "The keyword case type of the monitor.",
          default: "1",
          options: [
            {
              label: "Case Sensitive",
              value: "0",
            },
            {
              label: "Case Insensitive",
              value: "1",
            },
          ],
        },
        ...authProps,
      };
    }

    if (monitorType === constants.MONITOR_TYPE.HTTPS.value) {
      return {
        timeout,
        ...authProps,
      };
    }

    return {};
  },
  methods: {
    formatAlertContacts(alertContacts, useDefaultThresholdAndRecurrence = true) {
      const threshold = 0;
      const recurrence = 0;
      return utils.parseArray(alertContacts)
        ?.map((value) => useDefaultThresholdAndRecurrence
          ? `${value}_${threshold}_${recurrence}`
          : value)
        .join("-");
    },
    createMonitor(args = {}) {
      return this.app.post({
        path: "/newMonitor",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createMonitor,
      formatAlertContacts,
      type,
      friendlyName,
      url,
      interval,
      alertContacts,
      timeout,
      subType,
      port,
      keywordType,
      keywordValue,
      keywordCaseType,
      httpUsername,
      httpPassword,
      httpAuthType,
    } = this;

    const response = await createMonitor({
      $,
      data: {
        friendly_name: friendlyName,
        url,
        type,
        interval,
        alert_contacts: formatAlertContacts(alertContacts),
        timeout,
        sub_type: subType,
        port,
        keyword_type: keywordType,
        keyword_value: keywordValue,
        keyword_case_type: keywordCaseType,
        http_username: httpUsername,
        http_password: httpPassword,
        http_auth_type: httpAuthType,
      },
    });

    $.export("$summary", `Successfully created monitor with ID \`${response.monitor.id}\`.`);
    return response;
  },
};
