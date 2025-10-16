import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import transloadit from "../../transloadit.app.mjs";

export default {
  key: "transloadit-create-assembly",
  name: "Create Assembly",
  description: "Create a new assembly to process files using a specified template and steps. [See the documentation](https://transloadit.com/docs/api/assemblies-post/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    transloadit,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: By default, the `steps` parameter allows you to override Template Steps at runtime. However, if `Allow Steps Override` is set to `false`, then steps and `Template Id` become mutually exclusive. In this case, you can only supply one of these parameters. See [Overruling Templates at Runtime](https://transloadit.com/docs/topics/templates/#overruling-templates-at-runtime).",
    },
    allowStepsOverride: {
      type: "boolean",
      label: "Allow Steps Override",
      description: "Set this to `false` to disallow [Overruling Templates at Runtime](https://transloadit.com/docs/topics/templates/#overruling-templates-at-runtime). If you set this to `false` then `Template Id` and `Steps` will be mutually exclusive and you may only supply one of those parameters. Recommended when deploying Transloadit in untrusted environments. This makes sense to set as part of a Template, rather than on the Assembly itself when creating it.",
      default: true,
    },
    templateId: {
      propDefinition: [
        transloadit,
        "templateId",
      ],
      optional: true,
    },
    steps: {
      type: "object",
      label: "Steps",
      description: "Assembly Instructions comprise all the Steps executed on uploaded/imported files by the Transloadit back-end during file conversion or encoding. [See the documentation](https://transloadit.com/docs/topics/assembly-instructions/) for more information.",
      optional: true,
    },
    notifyUrl: {
      type: "string",
      label: "Notify URL",
      description: "Transloadit can send a Pingback to your server when the Assembly is completed. We'll send the Assembly status in a form url-encoded JSON string inside of a `transloadit` field in a multipart POST request to the URL supplied here.",
      optional: true,
    },
    quiet: {
      type: "boolean",
      label: "Quiet",
      description: "Set this to `true` to reduce the response from an Assembly POST request to only the necessary fields. This prevents any potentially confidential information being leaked to the end user who is making the Assembly request. A successful Assembly will only include the `ok` and `assembly_id` fields. An erroneous Assembly will only include the `error`, `http_code`, `message` and `assembly_id` fields. The full Assembly Status will then still be sent to the `Notify URL` if one was specified.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.allowStepsOverride && this.templateId && this.steps) {
      throw new ConfigurationError("Either 'templateId' or 'steps' must be provided, not both.");
    }
    if (!this.templateId && !this.steps) {
      throw new ConfigurationError("Either 'templateId' or 'steps' must be provided.");
    }

    try {
      const response = await this.transloadit.createAssembly({
        params: {
          template_id: this.templateId,
          steps: parseObject(this.steps),
          notify_url: this.notifyUrl,
          allow_steps_override: this.allowStepsOverride,
          quiet: this.quiet,
        },
      });

      if (response.results.resize) {
        $.export("$summary", `Assembly created successfully with ID ${response.assembly_id}`);
      } else {
        $.export("$summary", "The Assembly didn't produce any output. Make sure you used a valid image file");
      }

      return response;
    } catch (err) {
      let message = `Unable to process Assembly. ${err}`;
      if (err.assemblyId) {
        message += `More info: https://transloadit.com/assemblies/${err.assemblyId}`;
      }
      throw new ConfigurationError(message);
    }
  },
};
