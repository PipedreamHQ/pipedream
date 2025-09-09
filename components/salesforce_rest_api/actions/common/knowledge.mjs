import app from "../../salesforce_rest_api.app.mjs";

export default {
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please keep in mind that Salesforce Knowledge is available for an additional cost in: Professional Enterprise, Performance, and Developer Editions. For more information, contact your Salesforce representative. [See the documentation](https://help.salesforce.com/s/articleView?id=service.knowledge_map.htm&type=5)",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language code. Defaults to `en-US`.",
      optional: true,
    },
  },
};
