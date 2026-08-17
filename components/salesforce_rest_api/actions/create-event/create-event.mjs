// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import event from "../../common/sobjects/event.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_event.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-event",
  name: "Create Event",
  description: "Create a Salesforce calendar event (a meeting or appointment with a start and end time)."
    + " Use **Create Task** instead for to-do items with no scheduled time."
    + " Use **Find Records** to get the `WhoId` (contact or lead) and `WhatId` (related record) you want to link."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.7",
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
