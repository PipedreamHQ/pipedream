import common, { getProps } from "../common/base-create-update.mjs";
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
  version: "0.4.0",
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
      ? (await fs.promises.readFile(filePathOrContent)).toString("base64")
      : filePathOrContent;

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
