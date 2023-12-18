import salesforce from "../../salesforce_rest_api.app.mjs";
import caseComment from "../../common/sobjects/caseComment.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-create-casecomment",
  name: "Create CaseComment",
  description: toSingleLineString(`
    Creates a Case Comment that provides additional information about the associated Case.
    See [CaseComment SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_casecomment.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.4",
  type: "action",
  props: {
    salesforce,
    ParentId: {
      type: "string",
      label: "Parent ID",
      description: "Required. ID of the parent Case of the CaseComment.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} CaseComment`,
      options: () => Object.keys(caseComment),
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, caseComment);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "ParentId",
      ...this.selector,
    ]));
    const response = await this.salesforce.createCaseComment({
      $,
      data,
    });
    $.export("$summary", `Successfully created case comment for ${this.ParentId}`);
    return response;
  },
};
