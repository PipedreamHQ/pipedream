import browserstack from "../../browserstack.app.mjs";
import {
  MACRES_OPTIONS,
  ORIENTATION_OPTIONS,
  QUALITY_OPTIONS,
  WAITTIME_OPTIONS,
  WINRES_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "browserstack-take-screenshot",
  name: "Take Screenshot",
  description: "Generate screenshots for a URL across multiple browsers and devices. [See the documentation](https://www.browserstack.com/screenshots/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserstack,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the desired page to screenshot",
    },
    browser: {
      propDefinition: [
        browserstack,
        "browser",
      ],
      type: "string[]",
    },
    winRes: {
      type: "string",
      label: "Windows Resolution",
      description: "Screen resolution for browsers on Windows",
      options: WINRES_OPTIONS,
      optional: true,
    },
    macRes: {
      type: "string",
      label: "Mac Resolution",
      description: "Screen resolution for browsers on OSX",
      options: MACRES_OPTIONS,
      optional: true,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "Quality of the screenshot",
      options: QUALITY_OPTIONS,
      optional: true,
    },
    waitTime: {
      type: "integer",
      label: "Wait Time (seconds)",
      description: "Time in seconds to wait before taking the screenshot",
      options: WAITTIME_OPTIONS,
      optional: true,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Screen orientation for mobile devices",
      options: ORIENTATION_OPTIONS,
      optional: true,
    },
    local: {
      type: "boolean",
      label: "Local",
      description: "Set to true if the page is local and a Local Testing connection has been set up",
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "A public URL where results will be posted once processing is complete",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserstack.createScreenshotJob({
      $,
      data: {
        url: this.url,
        browsers: parseObject(this.browser),
        callback_url: this.callbackUrl,
        win_res: this.winRes,
        mac_res: this.macRes,
        quality: this.quality,
        wait_time: this.waitTime,
        orientation: this.orientation,
        local: this.local,
      },
    });

    $.export("$summary", `Created screenshot job ${response.job_id} with ${response.screenshots?.length || 0} screenshot(s)`);

    return response;
  },
};
