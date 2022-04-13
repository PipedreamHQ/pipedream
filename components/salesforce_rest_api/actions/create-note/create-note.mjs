import salesforce from "../../salesforce_rest_api.app.mjs";
import note from "../../common/sobjects/note.mjs";
import lodash from "lodash";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-salesforce-create-note",
  name: "Create Note",
  description: toSingleLineString(`
    Creates a note, which is text associated with a custom object or a standard object, such as a Contact, Contract, or Opportunity.
    See [Note SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_note.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    ParentId: {
      type: "string",
      label: "ParentId",
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
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, note);
  },
  async run({ $ }) {
    const data = lodash.pickBy(lodash.pick(this, [
      "ParentId",
      "Title",
      ...this.selector,
    ]));
    const response = await this.salesforce.createNote({
      $,
      data,
    });
    $.export("$summary", `Created note "${this.Title}"`);
    return response;
  },
};
