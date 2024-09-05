import salesforce_rest_api from "../../salesforce_rest_api.app.mjs";
import converter from "../../../helper_functions/actions/xml-to-json/xml-to-json.mjs";

export default {
  key: "salesforce_rest_api-convert-soap-xml-to-json",
  name: "Convert SOAP XML Object to JSON",
  description: "Converts a SOAP XML Object received from Salesforce to JSON",
  version: "0.0.6",
  type: "action",
  props: {
    salesforce_rest_api,
    infoBox: {
      type: "alert",
      alertType: "info",
      content: `This action is useful in conjunction with Salesforce Flow Builder, and is primarily used if Instant triggers are not working for your use case.
\\
[See the documentation](https://pipedream.com/apps/salesforce-rest-api#troubleshooting) for more details.`,
    },
    xml: {
      type: "string",
      label: "XML Soap Object",
      description: "The object received from Salesforce that will be converted.",
    },
    extractNotificationOnly: {
      type: "boolean",
      label: "Extract Notifications Only",
      description: "Whether to extract only the notification parts from the XML. Default: `true`.",
      optional: true,
      default: true,
    },
    failOnError: {
      type: "boolean",
      label: "Fail on Error",
      description: "Whether the action should fail if an error occurs when extracting notifications. Default: `false`.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const json = await converter.run.bind({
      input: this.xml,
      compact: false,
    })({
      $,
    });

    if (!this.extractNotificationOnly) {
      return json;
    }

    try {
      const notifications = json.elements[0].elements[0].elements[0].elements
        .filter(({ name }) => name === "Notification");
      $.export("$summary", "Successfully converted to JSON and extracted notifications");
      return {
        notifications,
      };
    } catch (e) {
      const errorMessage = "Successfully converted to JSON, but was unable to extract notifications";
      if (this.failOnError) {
        $.export("$summary", errorMessage); // overrides exported $summary in converter
        throw new Error(errorMessage);
      }

      $.export("$summary", `${errorMessage}. Will return the whole JSON.`);
      return json;
    }
  },
};
