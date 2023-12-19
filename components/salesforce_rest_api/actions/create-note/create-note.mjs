import common from "../common/base.mjs";
import note from "../../common/sobjects/note.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-note",
  name: "Create Note",
  description: toSingleLineString(`
    Creates a note, which is text associated with a custom object or a standard object, such as a Contact, Contract, or Opportunity.
    See [Note SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_note.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.5",
  type: "action",
  props: {
    salesforce,
    ParentId: {
      type: "string",
      label: "Parent ID",
      description: "ID of the object associated with the note.",
    },
    Title: {
      type: "string",
      label: "Title",
      description: "Title of the note.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Note`,
      options: () => Object.keys(note),
      reloadProps: true,
    },
  },
  additionalProps() {
    return this.additionalProps(this.selector, note);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "ParentId",
      "Title",
      ...this.selector,
    ]));
    const response = await this.salesforce.createNote({
      $,
      data,
    });
    $.export("$summary", `Successfully created note "${this.Title}"`);
    return response;
  },
};
