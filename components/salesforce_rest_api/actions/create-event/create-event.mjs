import salesforce from "../../salesforce_rest_api.app.mjs";
import {
  removeNullEntries, toSingleLineString,
} from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-create-event",
  name: "Create Event",
  description: toSingleLineString(`
    Creates an event, which represents an event in the calendar.
    See [Event SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_event.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.4",
  type: "action",
  props: {
    salesforce,
    IsAllDayEvent: {
      type: "boolean",
      label: "All-Day Event",
      description: "Indicates whether the ActivityDate field (true) or the ActivityDateTime field (false) is used to define the date or time of the event.",
      reloadProps: true,
    },
    AcceptedEventInviteeIds: {
      propDefinition: [
        salesforce,
        "AcceptedEventInviteeIds",
      ],
    },
    Description: {
      type: "string",
      label: "Description",
      description: "Contains a text description of the event. Limit: 32,000 characters.",
    },
    Subject: {
      type: "string",
      label: "Subject",
      description: "The subject line of the event, such as Call, Email, or Meeting. Limit: 255 characters.",
    },
  },
  async additionalProps() {
    const props = {};
    if (this.IsAllDayEvent) {
      props.ActivityDate = {
        type: "string",
        label: "Due Date Only (YYYY/MM/DD)",
        description: "Contains the event's due date if the IsAllDayEvent flag is set to true.",
      };
    } else {
      props.ActivityDateTime = {
        type: "string",
        label: "Due Date Time",
        description: "Contains the event's due date if the IsAllDayEvent flag is set to false. The time portion of this field is always transferred in the Coordinated Universal Time (UTC) time zone. Translate the time portion to or from a local time zone for the user or the application, as appropriate.",
      };
      props.DurationInMinutes = {
        type: "integer",
        label: "Duration in minutes",
        description: "Contains the event length, in minutes.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const data = removeNullEntries({
      IsAllDayEvent: this.IsAllDayEvent,
      AcceptedEventInviteeIds: this.AcceptedEventInviteeIds,
      Description: this.Description,
      Subject: this.Subject,
      ActivityDate: this.ActivityDate && new Date(this.ActivityDate).toUTCString(),
      ActivityDateTime: this.ActivityDateTime,
      DurationInMinutes: this.DurationInMinutes,
    });
    const response = await this.salesforce.createEvent({
      $,
      data,
    });
    $.export("$summary", "Succcessfully created event");
    return response;
  },
};
