import common, { getProps } from "../common/base-create-update.mjs";
import event from "../../common/sobjects/event.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_event.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-event",
  name: "Create Event",
  description: `Creates an event. [See the documentation](${docsLink})`,
  version: "0.3.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "Event";
    },
    getAdvancedProps() {
      return event.extraProps;
    },
  },
  props: getProps({
    objType: event,
    docsLink,
    showDateInfo: true,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ActivityDate,
      EndDateTime,
      RecurrenceEndDateOnly,
      RecurrenceStartDateTime,
      ReminderDateTime,
      StartDateTime,
      RecurrenceDayOfWeekMask,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Event", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          ActivityDate,
          EndDateTime,
          RecurrenceEndDateOnly,
          RecurrenceStartDateTime,
          ReminderDateTime,
          StartDateTime,
        }),
        RecurrenceDayOfWeekMask: RecurrenceDayOfWeekMask?.reduce?.((acc, val) => acc + val, 0),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Succcessfully created event${this.Subject
      ? ` "${this.Subject}"`
      : ""}`);
    return response;
  },
};
