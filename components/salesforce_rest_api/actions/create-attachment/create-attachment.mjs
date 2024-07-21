import common, { getProps } from "../common/base.mjs";
import attachment from "../../common/sobjects/attachment.mjs";
import fs from "fs";

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
  version: "0.4.{{ts}}",
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

    const body =  filePathOrContent.includes("tmp/")
      ? fs.createReadStream(filePathOrContent, {
        encoding: "base64 ",
      })
      : filePathOrContent;

    const response = await salesforce.createAttachment({
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
