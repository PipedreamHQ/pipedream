import common, { getProps } from "../common/base-create-update.mjs";
import event from "../../common/sobjects/event.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_event.htm";

const {
  additionalFields,
  ...baseProps
} = getProps({
  objType: event,
  docsLink,
  showDateInfo: true,
});

export default {
  ...common,
  key: "salesforce_rest_api-create-event",
  name: "Create Event",
  description: "Create a Salesforce calendar event (a meeting or appointment with a start and end time)."
    + " Use **Create Task** instead for to-do items with no scheduled time."
    + " Use **Find Records** to get the `WhoId` (contact or lead) and `WhatId` (related record) you want to link."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.4.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  methods: {
    ...common.methods,
  },
  props: {
    ...baseProps,
    Subject: event.extraProps.Subject,
    StartDateTime: event.extraProps.StartDateTime,
    RecurrenceStartDateTime: event.extraProps.RecurrenceStartDateTime,
    RecurrenceEndDateOnly: event.extraProps.RecurrenceEndDateOnly,
    RecurrenceDayOfWeekMask: event.extraProps.RecurrenceDayOfWeekMask,
    additionalFields,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ActivityDate,
      EndDateTime,
      StartDateTime,
      RecurrenceStartDateTime,
      RecurrenceEndDateOnly,
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
          StartDateTime,
          RecurrenceStartDateTime,
          RecurrenceEndDateOnly,
        }),
        ...(RecurrenceDayOfWeekMask?.length && {
          RecurrenceDayOfWeekMask: RecurrenceDayOfWeekMask.reduce((mask, day) => mask | day, 0),
        }),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", "Successfully created event");
    return response;
  },
};
