import rhombus from "../../rhombus.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "rhombus-create-shared-live-video-stream",
  name: "Create Shared Live Video Stream",
  description: "Create a shared live video stream and get the URL to access it. [See the documentation](https://apidocs.rhombus.com/reference/createcamerasharedlivevideostream))",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rhombus,
    deviceType: {
      type: "string",
      label: "Device Type",
      description: "The type of device to create a shared stream for",
      options: [
        {
          label: "Camera",
          value: "camera",
        },
        {
          label: "Doorbell Camera",
          value: "doorbell",
        },
      ],
      default: "camera",
    },
    streamType: {
      type: "string",
      label: "Stream Type",
      description: "The type of stream to create",
      options: constants.STREAM_TYPES,
    },
    vodEnabled: {
      type: "boolean",
      label: "VOD Enabled",
      description: "Enables recording of live footage to a VOD",
    },
    cameraUuid: {
      type: "string",
      label: "Camera ID",
      description: "The ID of a camera (required when device type is 'camera')",
      propDefinition: [
        rhombus,
        "cameraUuid",
      ],
      optional: true,
    },
    doorbellCameraUuid: {
      type: "string",
      label: "Doorbell Camera ID",
      description: "The ID of a doorbell camera (required when device type is 'doorbell')",
      propDefinition: [
        rhombus,
        "doorbellCameraUuid",
      ],
      optional: true,
    },
    includeAudio: {
      type: "boolean",
      label: "Include Audio",
      description: "Camera must be associated with an audio gateway to have audio. Required when device type is `camera`.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    let deviceUuid;

    if (this.deviceType === "camera") {
      if (!this.cameraUuid) {
        throw new ConfigurationError("Camera UUID is required when device type is 'camera'");
      }
      if (this.includeAudio === undefined || this.includeAudio === null) {
        throw new ConfigurationError("Include Audio is required when device type is 'camera'");
      }
      deviceUuid = this.cameraUuid;

      response = await this.rhombus.createSharedLiveVideoStream({
        $,
        data: {
          cameraUuid: this.cameraUuid,
          includeAudio: this.includeAudio,
          vodEnabled: this.vodEnabled,
          streamType: this.streamType,
        },
      });
    } else if (this.deviceType === "doorbell") {
      if (!this.doorbellCameraUuid) {
        throw new ConfigurationError("Doorbell Camera UUID is required when device type is 'doorbell'");
      }
      deviceUuid = this.doorbellCameraUuid;

      response = await this.rhombus.createDoorbellSharedLiveVideoStream({
        $,
        data: {
          doorbellCameraUuid: this.doorbellCameraUuid,
          includeAudio: this.includeAudio,
          vodEnabled: this.vodEnabled,
          streamType: this.streamType,
        },
      });
    } else {
      throw new Error(`Unsupported device type: ${this.deviceType}`);
    }

    // Extract the stream URL from the response
    const streamUrl = response.streamUrl || response.url;

    $.export("$summary", `Created shared live video stream '${this.streamName}' for ${this.deviceType} ${deviceUuid}`);

    // Export the stream URL for easy access
    if (streamUrl) {
      $.export("streamUrl", streamUrl);
    }

    return {
      ...response,
      streamUrl,
      deviceType: this.deviceType,
      deviceUuid,
    };
  },
};
