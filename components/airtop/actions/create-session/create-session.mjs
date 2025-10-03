import { parseObjectEntries } from "../../common/utils.mjs";
import app from "../../airtop.app.mjs";

export default {
  key: "airtop-create-session",
  name: "Create Session",
  description: "Create a new cloud browser session. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/sessions/create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    profileName: {
      type: "string",
      label: "Profile Name",
      description: "Name of a profile to load into the session",
      optional: true,
    },
    saveProfileOnTermination: {
      type: "boolean",
      label: "Save Profile on Termination",
      description: "If enabled, [the profile will be saved when the session terminates](https://docs.airtop.ai/api-reference/airtop-api/sessions/save-profile-on-termination). Only relevant if `Profile Name` is provided",
      optional: true,
    },
    timeoutMinutes: {
      type: "integer",
      label: "Timeout (Minutes)",
      description: "Number of minutes of inactivity (idle timeout) after which the session will terminate",
      optional: true,
    },
    record: {
      type: "boolean",
      label: "Record",
      description: "Whether to enable session recording",
      optional: true,
    },
    solveCaptcha: {
      type: "boolean",
      label: "Solve Captcha",
      description: "Whether to automatically solve captcha challenges",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional configuration parameters to send in the request. [See the documentation](https://docs.airtop.ai/api-reference/airtop-api/sessions/create) for available parameters (e.g., `proxy`). Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      profileName,
      saveProfileOnTermination,
      timeoutMinutes,
      record,
      solveCaptcha,
      additionalOptions,
    } = this;

    const data = {
      configuration: {
        profileName,
        timeoutMinutes,
        record,
        solveCaptcha,
        ...parseObjectEntries(additionalOptions),
      },
    };

    const response = await this.app.createSession({
      $,
      data,
    });

    const sessionId = response.id;

    let saveProfileOnTerminationResponse;
    if (saveProfileOnTermination && profileName) {
      saveProfileOnTerminationResponse = await this.app.saveProfileOnTermination({
        $,
        sessionId,
        profileName,
      });
    }

    $.export("$summary", `Successfully created session \`${sessionId}\` with status: ${response.status}`);
    return {
      response,
      saveProfileOnTerminationResponse,
    };
  },
};

