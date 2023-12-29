import common from "../common/base.mjs";
import attachment from "../../common/sobjects/attachment.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-attachment",
  name: "Create Attachment",
  description: toSingleLineString(`
    Creates an attachment, which represents a file that a User has uploaded and attached to a parent object.
    See [Attachment SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_attachment.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.3.6",
  type: "action",
  props: {
    salesforce,
    Body: {
      type: "string",
      label: "Body",
      description: "Encoded file data.",
    },
    Name: {
      type: "string",
      label: "Name",
      description: "Name of the attached file. Maximum size is 255 characters.",
    },
    ParentId: {
      type: "string",
      label: "Parent ID",
      description: "ID of the parent object of the attachment. The following objects are supported as parents of attachments:\n* Account\n* Asset\n* Campaign\n* Case\n* Contact\n* Contract\n* Custom objects\n* EmailMessage\n* EmailTemplate\n* Event\n* Lead\n* Opportunity\n* Product2\n* Solution\n* Task",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Attachment`,
      options: () => Object.keys(attachment),
      reloadProps: true,
    },
  },
  additionalProps() {
    return this.additionalProps(this.selector, attachment);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "Body",
      "Name",
      "ParentId",
      ...this.selector,
    ]));
    const response = await this.salesforce.createAttachment({
      $,
      data,
    });
    $.export("$summary", `Successfully created attachment "${this.Name}"`);
    return response;
  },
};
