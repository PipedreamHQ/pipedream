import common, { getProps } from "../common/base-create-update.mjs";
import attachment from "../../common/sobjects/attachment.mjs";
import { getFileStream } from "@pipedream/platform";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_attachment.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-attachment",
  name: "Create Attachment",
  description: "Attach a file to an existing Salesforce record (classic `Attachment` object)."
    + " Use **Find Records** to get the parent record ID first."
    + " For newer orgs prefer Salesforce Files - use **Insert Blob Data** with `ContentVersion` instead."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.6.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: getProps({
    objType: attachment,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      filePathOrContent,
      additionalFields,
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
        ...data,
        ...getAdditionalFields(),
        Body: body,
      },
    });
    $.export("$summary", `Successfully created attachment "${this.Name}"`);
    return response;
  },
};
