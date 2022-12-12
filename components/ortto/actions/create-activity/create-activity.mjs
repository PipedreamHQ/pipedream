import app from "../../ortto.app.mjs";

export default {
  key: "ortto-create-activity",
  name: "Create an Activity",
  description: "Creates one custom activity definitions in Ortto’s customer data platform (CDP). [See the docs](https://help.ortto.com/developer/latest/developer-guide/custom-activities-guide.html#create-an-activity-in-ortto-via-api).",
  type: "action",
  version: "0.0.5",
  props: {
    app,
    orgCustomFieldId: {
      propDefinition: [
        app,
        "orgCustomFieldId",
      ],
    },
  },
  async run() {},
};
