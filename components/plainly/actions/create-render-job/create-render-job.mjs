import plainly from "../../plainly.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "plainly-create-render-job",
  name: "Create Render Job",
  description: "Creates a render job for a video template. [See the documentation](https://www.plainlyvideos.com/documentation/api-reference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    plainly,
    projectId: {
      propDefinition: [
        plainly,
        "projectId",
      ],
    },
    templateId: {
      propDefinition: [
        plainly,
        "templateId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "User-defined attributes of the render. The field batchRenderId is reserved and should be a string. The field batchRenderSequenceNo is reserved and should be a number. Keys in this map must not contain dots.",
      optional: true,
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Map of parameters to use in order to resolve the template parametrized layers. Keys in this map must not contain dots.",
      optional: true,
    },
    configureOptions: {
      type: "boolean",
      label: "Configure Options",
      description: "Set to `true` to enter values for the map of additional options for the render",
      optional: true,
      reloadProps: true,
    },
    captionsPosition: {
      type: "string",
      label: "Captions Position",
      description: "The position of captions. Default: `BOTTOM`",
      options: [
        "TOP",
        "CENTER",
        "BOTTOM",
      ],
      optional: true,
      hidden: true,
    },
    captionsStyle: {
      type: "string",
      label: "Captions Style",
      description: "The style of captions. Default: `BASIC`",
      options: [
        "BASIC",
        "BASIC_WITH_STROKE_AND_SHADOW",
        "BASIC_WITH_SHADOW",
        "POPPINS_WHITE",
        "POPPINS_WHITE_VERTICAL",
      ],
      optional: true,
      hidden: true,
    },
    srtFileUrl: {
      type: "string",
      label: "SRT File URL",
      description: "Url to the srt file",
      optional: true,
      hidden: true,
    },
    passthrough: {
      type: "string",
      label: "Passthrough",
      description: "Data to be sent to the integration as the integrationPassthrough parameter. Serves to pass arbitrary data to your active integrations. Could be any string or a render parameter reference in formats {{parameterName}} or {{parameterName:defaultValue}}, including a reference to {{webhookPassthrough}} in the same manner`.",
      optional: true,
      hidden: true,
    },
    skipAll: {
      type: "boolean",
      label: "Skip All",
      description: "If true, any active integration for this project or template will not be triggered.",
      optional: true,
      hidden: true,
    },
    thumbnailAtSeconds: {
      type: "string[]",
      label: "Thumbnail At Seconds",
      description: "Generated thumbnails would be PNG thumbnails based on specified timestamps in seconds",
      optional: true,
      hidden: true,
    },
    thumbnailFormat: {
      type: "string",
      label: "Thumbnail Format",
      description: "The format of the thumbnails",
      options: [
        "PNG",
        "JPG",
      ],
      optional: true,
      hidden: true,
    },
    thumbnailFrequencySeconds: {
      type: "integer",
      label: "Thumbnail Frequency Seconds",
      description: "Frequency in seconds to export a frame. For example, having the value frequencySeconds=5 and a rendered video that lasts 15 sec, would create 3 PNGs.",
      optional: true,
      hidden: true,
    },
    thumbnailFromEncodedVideo: {
      type: "boolean",
      label: "Thumbnail From Encoded Video",
      description: "When set to true, the thumbnails will be generated from the encoded video. If set to false, the thumbnails will be generated from the video outputted by the After Effects rendering process.",
      optional: true,
      hidden: true,
    },
    watermarkEncodingParamsLine: {
      type: "string",
      label: "Watermark Encodeing Params Line",
      description: "Additional ffmpeg command line parameters to change watermark position, size, etc. If not specified, the watermark is placed at the top left corner with opacity of 0.8.",
      optional: true,
      hidden: true,
    },
    watermarkUrl: {
      type: "string",
      label: "Watermark URL",
      description: "A public url to the watermark image or video",
      optional: true,
      hidden: true,
    },
    uploadEnabled: {
      type: "boolean",
      label: "Upload Enabled",
      description: "Enables uploading modified project files as a zip archive",
      optional: true,
      hidden: true,
    },
    configureOutputFormat: {
      type: "boolean",
      label: "Configure Output Format",
      description: "Set to `true` to enter values used for rendering output. If not specified defaults to default output format for the target After Effects version",
      optional: true,
      reloadProps: true,
    },
    attachment: {
      type: "boolean",
      label: "Attachment",
      description: "If the output file should be consider as an attachment, meaning that the video link will initiate a download of the file in a web browser.",
      optional: true,
      hidden: true,
    },
    attachmentFileName: {
      type: "string",
      label: "Attachment File Name",
      description: "Optional, name of the file when downloading as attachment. Note that this has effect only if attachment is true. The file name must be provided without extension which will be added automatically based on the selected format.",
      optional: true,
      hidden: true,
    },
    outputModule: {
      type: "string",
      label: "Output Module",
      description: "The output module defines the format of the video generated by the After Effects",
      options: [
        "H_264",
        "H_264_HIGH_BIT_RATE",
        "HQ",
        "HQ_ALPHA",
      ],
      optional: true,
      hidden: true,
    },
    settingsTemplate: {
      type: "string",
      label: "Settings Template",
      description: "Defines render settings template to be used during After Effects rendering",
      options: [
        "BEST_SETTINGS",
        "DRAFT",
      ],
      optional: true,
      hidden: true,
    },
    configureWebhook: {
      type: "boolean",
      label: "Configure Webhook",
      description: "Set to `true` to enter webhook properties. A webhook HTTP(S) call expects a 2xx status code in order to be marked as successful. In case of a failed delivery, Plainly will attempt to re-call your webhook for up to one day in space of 15 minutes. A webhook HTTP(S) request has a timeout of 30 seconds. A webhook HTTP(S) request does follow redirects.",
      optional: true,
      reloadProps: true,
    },
    onFailure: {
      type: "boolean",
      label: "On Failure",
      description: "Should webhook be called also on the failed renders",
      optional: true,
      hidden: true,
    },
    onInvalid: {
      type: "boolean",
      label: "On Invalid",
      description: "Should webhook be called also on the invalid renders",
      optional: true,
      hidden: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The HTTP(S) webhook URL to execute the POST call once the rendering is finished",
      optional: true,
      hidden: true,
    },
  },
  additionalProps(props) {
    // captions options
    props.captionsPosition.hidden = !this.configureOptions;
    props.captionsStyle.hidden = !this.configureOptions;
    props.srtFileUrl.hidden = !this.configureOptions;

    // integrations options
    props.passthrough.hidden = !this.configureOptions;
    props.skipAll.hidden = !this.configureOptions;

    // project files options
    props.uploadEnabled.hidden = !this.configureOptions;

    // thumbnail options
    props.thumbnailAtSeconds.hidden = !this.configureOptions;
    props.thumbnailFormat.hidden = !this.configureOptions;
    props.thumbnailFrequencySeconds.hidden = !this.configureOptions;
    props.thumbnailFromEncodedVideo.hidden = !this.configureOptions;

    // watermark options
    props.watermarkEncodingParamsLine.hidden = !this.configureOptions;
    props.watermarkUrl.hidden = !this.configureOptions;

    // output format config
    props.attachment.hidden = !this.configureOutputFormat;
    props.attachmentFileName.hidden = !this.configureOutputFormat;
    props.outputModule.hidden = !this.configureOutputFormat;
    props.settingsTemplate.hidden = !this.configureOutputFormat;

    // webhook config
    props.onFailure.hidden = !this.configureWebhook;
    props.onInvalid.hidden = !this.configureWebhook;
    props.webhookUrl.hidden = !this.configureWebhook;
    props.webhookUrl.optional = !this.configureWebhook;

    return {};
  },
  async run({ $ }) {
    if ((this.captionsPosition || this.captionsStyle) && !this.srtFileUrl) {
      throw new ConfigurationError("SRT File URL is required if setting Captions Position or Style");
    }

    if (this.watermarkEncodingParamsLine && !this.watermarkUrl) {
      throw new ConfigurationError("Must specify Watermark URL if specifying Watermark Encoding Params Line");
    }

    const response = await this.plainly.createRender({
      $,
      data: {
        projectId: this.projectId,
        templateId: this.templateId,
        attributes: parseObjectEntries(this.attributes),
        parameters: parseObjectEntries(this.parameters),
        options: {
          captions: this.srtFileUrl
            ? {
              captionsPosition: this.captionsPosition,
              captionsStyle: this.captionsStyle,
              srtFileUrl: this.srtFileUrl,
            }
            : undefined,
          integration: {
            passthrough: this.passthrough,
            skipAll: this.skipAll,
          },
          projectFiles: {
            uploadEnabled: this.uploadEnabled,
          },
          thumbnails: {
            atSeconds: this.thumbnailAtSeconds,
            format: this.thumbnailFormat,
            frequencySeconds: this.thumbnailFrequencySeconds,
            fromEncodedVideo: this.thumbnailFromEncodedVideo,
          },
          watermark: this.watermarkUrl
            ? {
              encodingParamsLine: this.watermarkEncodingParamsLine,
              url: this.watermarkUrl,
            }
            : undefined,
        },
        outputFormat: {
          attachment: this.attachment,
          attachmentFileName: this.attachmentFileName,
          outputModule: this.outputModule,
          settingsTemplate: this.settingsTemplate,
        },
        webhook: this.webhookUrl
          ? {
            onFailure: this.onFailure,
            onInvalid: this.onInvalid,
            url: this.webhookUrl,
          }
          : undefined,
      },
    });
    $.export("$summary", `Successfully created render with ID: ${response.id}`);
    return response;
  },
};
