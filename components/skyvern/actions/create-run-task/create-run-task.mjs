import { parseObject } from "../../common/utils.mjs";
import skyvern from "../../skyvern.app.mjs";

export default {
  key: "skyvern-create-run-task",
  name: "Create and Run Task",
  description: "Create a new task and run it instantly in Skyvern. Useful for one-off automations. [See the documentation](https://docs.skyvern.com/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    skyvern,
    url: {
      type: "string",
      label: "URL",
      description: "It must be a http or https URL.",
    },
    navigationGoal: {
      type: "string",
      label: "Navigation Goal",
      description: "The prompt that tells the agent what the user-facing goal is. This is the guiding light for the LLM as it navigates a particular website / sitemap to achieve this specified goal.",
      optional: true,
    },
    dataExtractionGoal: {
      type: "string",
      label: "Data Extraction Goal",
      description: "The prompt that instructs the agent to extract information once the agent has achieved its **User Goal**.",
      optional: true,
    },
    navigationPayload: {
      type: "object",
      label: "Navigation Payload",
      description: "JSON-formatted payload with any \"facts\" or information that would help the agent perform its job. In the case of navigating an insurance quote, this payload would include any user information to help fill out the insurance flow such as date of birth, or age they got their license, and so on. This can include nested information, and the formatting isn't validated.",
      optional: true,
    },
    webhookCallbackUrl: {
      propDefinition: [
        skyvern,
        "webhookCallbackUrl",
      ],
      description: "The callback URL once our system is finished processing this async task.",
      optional: true,
    },
    extractedInformationSchema: {
      type: "object",
      label: "Extracted Information Schema",
      description: "Used to enforce a JSON schema spec to be enforced in the data_extraction_goal. Similar to [https://json-schema.org/](https://json-schema.org/) definition.",
      optional: true,
    },
    totpVerificationUrl: {
      type: "string",
      label: "TOTP Verification URL",
      description: "The URL of your TOTP endpoint. If this field is provided, Skyvern will call the URL to fetch the TOTP/2FA/MFA code when needed.",
      optional: true,
    },
    totpIdentifier: {
      type: "string",
      label: "TOTP Identifier",
      description: "The email address or the phone number which receives the TOTP/2FA/MFA code. If this field is provided, Skyvern will fetch the code that is pushed to [Skyvern's TOTP API](https://docs.skyvern.com/running-tasks/advanced-features#push-code-to-skyvern).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.skyvern.createAndRunTask({
      $,
      data: {
        url: this.url,
        navigation_goal: this.navigationGoal,
        data_extraction_goal: this.dataExtractionGoal,
        navigation_payload: parseObject(this.navigationPayload),
        webhook_callback_url: this.webhookCallbackUrl,
        proxyLocation: "RESIDENTIAL",
        extracted_information_schema: parseObject(this.extractedInformationSchema),
        totp_verification_url: this.totpVerificationUrl,
        totp_identifier: this.totpIdentifier,
      },
    });
    $.export("$summary", `Created and ran task with ID ${response.task_id}`);
    return response;
  },
};
