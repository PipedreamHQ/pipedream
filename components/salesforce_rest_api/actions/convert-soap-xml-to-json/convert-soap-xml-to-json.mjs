import salesforce_rest_api from "../../salesforce_rest_api.app.mjs";
import converter from "../../../helper_functions/actions/xml-to-json/xml-to-json.mjs";

export default {
  key: "salesforce_rest_api-convert-soap-xml-to-json",
  name: "Convert SOAP XML Object to JSON",
  description: "Converts a SOAP XML Object received from Salesforce to JSON",
  version: "0.0.2",
  type: "action",
  props: {
    salesforce_rest_api,
    xml: {
      type: "string",
      label: "XML Soap Object",
      description: "The object received from Salesforce that will be converted.",
    },
    extractNotificationOnly: {
      type: "boolean",
      label: "Extract Notifications Only",
      description: "Extracts only the notification parts from the XML. Default: `true`.",
      optional: true,
      default: true,
    },
    failOnError: {
      type: "boolean",
      label: "Fail on Error",
      description: "If should fail on error when extracting notifications. Default: `false`.",
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
