export default {
  AcceptedEventInviteeIds: {
    type: "string",
    label: "Accepted Event Invitee IDs",
    description: "A string array of contact or lead IDs who accepted this event. This JunctionIdList is linked to the AcceptedEventRelation child relationship. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
  },
  ActivityDate: {
    type: "string",
    label: "Activity Date",
    description: "Contains the event's due date if the IsAllDayEvent flag is set to true. This field is a date field with a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. Don't attempt to alter the timestamp to account for time zone differences. Label is Due Date Only.This field is required in versions 12.0 and earlier if the IsAllDayEvent flag is set to true. The value for this field and StartDateTime must match, or one of them must be null.",
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
};
