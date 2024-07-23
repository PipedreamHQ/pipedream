import common, { getProps } from "../common/base-create-update.mjs";
import event from "../../common/sobjects/event.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_event.htm";

export default {
  key: "salesforce_rest_api-create-event",
  name: "Create Event",
  description: `Creates an event. [See the documentation](${docsLink})`,
  version: "0.3.0",
  type: "action",
  methods: {
    ...common.methods,
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
    const response = await salesforce.createEvent({
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
