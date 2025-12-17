import FormData from "form-data";
import {
  TYPE_OPTIONS, WHAT_RECIPIENTS_OPTIONS,
} from "../../common/constants.mjs";
import { getFileData } from "../../common/utils.mjs";
import stannp from "../../stannp.app.mjs";

export default {
  key: "stannp-create-campaign",
  name: "Create a New Campaign",
  description: "Create a new campaign in Stannp. [See the documentation](https://www.stannp.com/us/direct-mail-api/campaigns)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    stannp,
    name: {
      type: "string",
      label: "Campaign Name",
      description: "Name your campaign for reference.",
    },
    type: {
      type: "string",
      label: "Campaign Type",
      description: "The type of campaign this will be. Make sure the image is in the correct format.",
      options: TYPE_OPTIONS,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Select the template ID",
      optional: true,
    },
    groupId: {
      propDefinition: [
        stannp,
        "groupId",
      ],
      optional: true,
    },
    whatRecipients: {
      type: "string",
      label: "What Recipients",
      description: "What recipients do you want this campaign to go to?",
      options: WHAT_RECIPIENTS_OPTIONS,
      optional: true,
    },
    addons: {
      type: "string",
      label: "Addons",
      description: "If you have an addon code.",
      optional: true,
    },
    admail: {
      type: "boolean",
      label: "Admail",
      description: "Set to true to benefit from admail discounts. Must comply with advertising mail restrictions.",
      optional: true,
    },
    file: {
      type: "string",
      label: "PDF File Path or URL",
      description: "A PDF file to use as the design artwork. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
      optional: true,
      reloadProps: true,
    },
    front: {
      type: "string",
      label: "Front Image Path or URL",
      description: "A PDF or JPG file to use as the front image. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.jpg`)",
      optional: true,
      reloadProps: true,
    },
    back: {
      type: "string",
      label: "Back Image Path or URL",
      description: "A PDF or JPG file to use as the back image. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.jpg`)",
      optional: true,
      reloadProps: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    let optional = true;
    if (this.file || this.front || this.back) {
      optional = false;
    }
    return {
      size: {
        type: "string",
        label: "Size",
        description: "Example '4x6' or '6x9' or 6x11'",
        optional,
      },
    };
  },
  async run({ $ }) {
    const {
      stannp,
      templateId,
      groupId,
      whatRecipients,
      file,
      front,
      back,
      admail,
      ...data
    } = this;

    const formData = new FormData();

    if (file) {
      const {
        stream, metadata,
      } = await getFileData(file);
      formData.append("file", stream, metadata);
    }
    if (front) {
      const {
        stream, metadata,
      } = await getFileData(front);
      formData.append("front", stream, metadata);
    }
    if (back) {
      const {
        stream, metadata,
      } = await getFileData(back);
      formData.append("back", stream, metadata);
    }

    if (templateId) formData.append("template_id", templateId);
    if (groupId) formData.append("group_id", groupId);
    if (whatRecipients) formData.append("what_recipients", whatRecipients);
    if (typeof admail === "boolean") formData.append("admail", `${admail}`);
    for (const [
      key,
      value,
    ] of Object.entries(data)) {
      formData.append(key, value);
    }

    const response = await stannp.createCampaign({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", `Successfully created campaign with ID: ${response.data}`);
    return response;
  },
};
