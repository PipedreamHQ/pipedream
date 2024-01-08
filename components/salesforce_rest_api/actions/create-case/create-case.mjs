import common from "../common/base.mjs";
import salesforceCase from "../../common/sobjects/case.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-case",
  name: "Create Case",
  description: toSingleLineString(`
    Creates a Salesforce case, which represents a customer issue or problem.
    See [Case SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_case.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.6",
  type: "action",
  props: {
    salesforce,
    SuppliedEmail: {
      type: "string",
      label: "Supplied email",
      description: "The email address that was entered when the case was created. Label is Email.If your organization has an active auto-response rule, SuppliedEmail is required when creating a case via the API. Auto-response rules use the email in the contact specified by ContactId. If no email address is in the contact record, the email specified here is used.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Case`,
      options: () => Object.keys(salesforceCase),
      reloadProps: true,
    },
  },
  additionalProps() {
    return this.additionalProps(this.selector, salesforceCase);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "SuppliedEmail",
      ...this.selector,
    ]));
    const response = await this.salesforce.createCase({
      $,
      data,
    });
    $.export("$summary", `Successfully created case for ${this.SuppliedEmail}`);
    return response;
  },
};
