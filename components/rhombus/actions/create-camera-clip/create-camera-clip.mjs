import rhombus from "../../rhombus.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "rhombus-create-camera-clip",
  name: "Create Camera Clip",
  description: "Create a camera clip from video footage. [See the documentation](https://apidocs.rhombus.com/reference/splicev3)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rhombus,
    clipType: {
      type: "string",
      label: "Clip Type",
      description: "The type of clip to create",
      options: [
        {
          label: "Arbitrary Clip (Splice)",
          value: "splice",
        },
        {
          label: "Policy Alert Clip",
          value: "policyAlert",
        },
      ],
      default: "splice",
    },
    cameraUuid: {
      type: "string",
      label: "Camera ID",
      description: "The ID of a camera (required for arbitrary clips)",
      propDefinition: [
        rhombus,
        "cameraUuid",
      ],
      optional: true,
    },
    startTimeMills: {
      type: "string",
      label: "Start Time",
      description: "The start time for the clip (in milliseconds since the Unix epoch) - required for arbitrary clips",
      optional: true,
    },
    durationSec: {
      type: "integer",
      label: "Duration (sec)",
      description: "The duration of the clip (in seconds)",
      optional: true,
    },
    policyAlertUuid: {
      type: "string",
      label: "Policy Alert UUID",
      description: "The UUID of the policy alert to save as a clip (required for policy alert clips)",
      optional: true,
    },
    clipName: {
      type: "string",
      label: "Clip Name",
      description: "A name for the created clip",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the created clip",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;

    if (this.clipType === "splice") {
      // Validate required fields for splice
      if (!this.cameraUuid) {
        throw new ConfigurationError("Camera UUID is required for arbitrary clips");
      }
      if (!this.startTimeMills) {
        throw new ConfigurationError("Start time is required for arbitrary clips");
      }

      response = await this.rhombus.spliceV3({
        $,
        data: {
          deviceUuids: [
            this.cameraUuid,
          ],
          startTimeMillis: this.startTimeMills,
          durationSec: this.durationSec,
          title: this.clipName,
          description: this.description,
        },
      });

      $.export("$summary", `Created arbitrary clip for camera ${this.cameraUuid}`);
    } else if (this.clipType === "policyAlert") {
      // Validate required fields for policy alert
      if (!this.policyAlertUuid) {
        throw new ConfigurationError("Policy Alert UUID is required for policy alert clips");
      }

      response = await this.rhombus.savePolicyAlertV2({
        $,
        data: {
          alertUuid: this.policyAlertUuid,
          savedClipTitle: this.clipName,
          savedClipDescription: this.description,
        },
      });

      $.export("$summary", `Created policy alert clip from policy alert ${this.policyAlertUuid}`);
    } else {
      throw new ConfigurationError(`Unsupported clip type: ${this.clipType}`);
    }

    return response;
  },
};
