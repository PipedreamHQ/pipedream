import salesforce from "../../salesforce_rest_api.app.mjs";
import event from "../../common/sobjects/event.mjs";
import {
  pickBy, pick,
} from "lodash";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-create-event",
  name: "Create Event",
  description: toSingleLineString(`
    Creates an event, which represents an event in the calendar.
    See [Event SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_event.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    durationInMinutes: {
      type: "integer",
      label: "Duration in minutes",
      description: "Contains the event length, in minutes.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Event`,
      options: () => Object.keys(event),
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, event);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "durationInMinutes",
      ...this.selector,
    ]));
    const response = await this.salesforce.createEvent({
      $,
      data,
    });
    $.export("$summary", "Succcessfully created event");
    return response;
  },
};
