import { PRIVACY_OPTION } from "../../common/constants.mjs";
import app from "../../h_supertools_analytics_tool.app.mjs";

export default {
  key: "h_supertools_analytics_tool-create-report",
  name: "Create Report",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new analytics report for a specified website. [See the documentation](https://analytics.h-supertools.com/developers/websites)",
  type: "action",
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain name.",
    },
    email: {
      type: "boolean",
      label: "Email",
      description: "Periodic email reports.",
      default: false,
    },
    excludeBots: {
      type: "boolean",
      label: "Exclude Bots",
      description: "Exclude common bots from being tracked.",
      default: false,
    },
    excludeParams: {
      type: "string",
      label: "Exclude Params",
      description: "Exclude URL query params from being tracked. One per line.",
      optional: true,
    },
    excludeIps: {
      type: "string",
      label: "Exclude IPs",
      description: "Exclude IPs from being tracked. One per line.",
      optional: true,
    },
    privacy: {
      type: "integer",
      label: "Privacy",
      description: "Status page privacy.",
      options: Object.values(PRIVACY_OPTION),
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.privacy === PRIVACY_OPTION.PASSWORD.value) {
      props.password = {
        type: "string",
        label: "Password",
        description: "The password for the statistics page.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      app,
      email,
      excludeBots,
      excludeParams,
      excludeIps,
      privacy,
      ...data
    } = this;

    const response = await app.createReport({
      $,
      data: {
        ...data,
        email: +email,
        exclude_bots: +excludeBots,
        exclude_params: excludeParams,
        exclude_ips: excludeIps,
        privacy: privacy - 1,
      },
    });

    $.export("$summary", `A new report with id: ${response.data.id} was successfully created!`);
    return response;
  },
};
