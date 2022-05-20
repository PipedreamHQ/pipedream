import salesforce from "../../salesforce_rest_api.app.mjs";
import event from "../../common/sobjects/event.mjs";
import lodash from "lodash";
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
    DurationInMinutes: {
      type: "integer",
      label: "Duration In Minutes",
      description: "Contains the event length, in minutes. Even though this field represents a temporal value, it is an integer typenot a Date/Time type.Required in versions 12.0 and earlier if IsAllDayEvent is false. In versions 13.0 and later, this field is optional, depending on the following: If IsAllDayEvent is true, you can supply a value for either DurationInMinutes or EndDateTime. Supplying values in both fields is allowed if the values add up to the same amount of time. If both fields are null, the duration defaults to one day. If IsAllDayEvent is false, a value must be supplied for either DurationInMinutes or EndDateTime. Supplying values in both fields is allowed if the values add up to the same amount of time. If the multiday event feature is enabled, then API versions 13.0 and later support values greater than 1440 for the DurationInMinutes field. API versions 12.0 and earlier can't access event objects whose DurationInMinutes is greater than 1440. For more information, see Multiday Events. Depending on your API version, errors with the DurationInMinutes and EndDateTime fields may appear in different places. Versions 38.0 and beforeErrors always appear in the DurationInMinutes field. Versions 39.0 and laterIf there's no value for the DurationInMinutes field, errors appear in the EndDateTime field. Otherwise, they appear in the DurationInMinutes field.",
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
    const data = lodash.pickBy(lodash.pick(this, [
      "DurationInMinutes",
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
