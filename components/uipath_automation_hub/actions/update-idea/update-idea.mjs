import { ConfigurationError } from "@pipedream/platform";
import app from "../../uipath_automation_hub.app.mjs";

export default {
  key: "uipath_automation_hub-update-idea",
  name: "Update Idea",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Modify an existing automation idea's details. [See the documentation](https://automation-hub.uipath.com/api/v1/api-doc/#/Automation%20Ideas/SubmitIdeaEmployeeDrivenwithSubmitter)",
  type: "action",
  props: {
    app,
    automationId: {
      propDefinition: [
        app,
        "automationId",
      ],
    },
    processName: {
      propDefinition: [
        app,
        "processName",
      ],
      optional: true,
    },
    processDescription: {
      propDefinition: [
        app,
        "processDescription",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      automationId,
      processName,
      processDescription,
    } = this;

    const dataObj = {};
    if (processName) {
      dataObj["OVR-OVERVIEW_NAME"] = {
        "value": processName,
      };
    }
    if (processDescription) {
      dataObj["OVR-OVERVIEW_DESCRIPTION"] = {
        "value": processDescription,
      };
    }

    if (!Object.entries(dataObj).length) {
      throw new ConfigurationError("You must fill in at least one of the fields.");
    }

    const response = await app.updateIdea({
      $,
      automationId,
      data: {
        "user_inputs": {
          "OVR": {
            "ah-section-ovr-0-0": dataObj,
          },
        },
      },
    });

    $.export("$summary", `The idea with Id: ${automationId} was successfully updated!`);
    return response;
  },
};
