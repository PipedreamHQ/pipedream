import common, { getProps } from "../common/base-create-update.mjs";
import attachment from "../../common/sobjects/attachment.mjs";
import { getFileStream } from "@pipedream/platform";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_attachment.htm";

/* eslint-disable no-unused-vars */
const {
  useAdvancedProps, ...props
} = getProps({
  objType: attachment,
  docsLink,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-create-attachment",
  name: "Create Attachment",
  description: `Creates an Attachment on a parent object. [See the documentation](${docsLink})`,
  version: "0.5.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props,
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      filePathOrContent,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */

    let body;
    if (filePathOrContent.startsWith("http") || filePathOrContent.includes("tmp/")) {
      const stream = await getFileStream(filePathOrContent);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks).toString("base64");
    } else {
      body = filePathOrContent;
    }

    const response = await salesforce.createRecord("Attachment", {
      $,
      data: {
        Body: body,
        ...data,
      },
    });
    $.export("$summary", `Successfully created attachment "${this.Name}"`);
    return response;
  },
};
