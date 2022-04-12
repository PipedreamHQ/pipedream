export default {
  AcceptedEventInviteeIds: {
    type: "string",
    label: "AcceptedEventInviteeIds",
    description: "A string array of contact or lead IDs who accepted this event. This JunctionIdList is linked to the AcceptedEventRelation child relationship. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
  },
  ActivityDate: {
    type: "string",
    label: "ActivityDate",
    description: "Contains the event's due date if the IsAllDayEvent flag is set to true. This field is a date field with a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. Don't attempt to alter the timestamp to account for time zone differences. Label is Due Date Only.This field is required in versions 12.0 and earlier if the IsAllDayEvent flag is set to true. The value for this field and StartDateTime must match, or one of them must be null.",
  },
  ActivityDateTime: {
    type: "string",
    label: "ActivityDateTime",
    description: "Contains the event's due date if the IsAllDayEvent flag is set to false. The time portion of this field is always transferred in the Coordinated Universal Time (UTC) time zone. Translate the time portion to or from a local time zone for the user or the application, as appropriate. Label is Due Date Time.This field is required in versions 12.0 and earlier if the IsAllDayEvent flag is set to false. The value for this field and StartDateTime must match, or one of them must be null.",
  },
  CurrencyIsoCode: {
    type: "string",
    label: "CurrencyIsoCode",
    description: "Available only for organizations with the multicurrency feature enabled. Contains the ISO code for any currency allowed by the organization.",
  },
  DeclinedEventInviteeIds: {
    type: "string",
    label: "DeclinedEventInviteeIds",
    description: "A string array of contact, lead, or user IDs who declined this event. This JunctionIdList is linked to the DeclinedEventRelation child relationship. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Contains a text description of the event. Limit: 32,000 characters.",
  },
  EndDateTime: {
    type: "string",
    label: "EndDateTime",
    description: "Available in versions 13.0 and later. The time portion of this field is always transferred in the Coordinated Universal Time (UTC) time zone. Translate the time portion to or from a local time zone for the user or the application, as appropriate.This field is optional, depending on the following: If IsAllDayEvent is true, you can supply a value for either DurationInMinutes or EndDateTime. Supplying values in both fields is allowed if the values add up to the same amount of time. If both fields are null, the duration defaults to one day. If IsAllDayEvent is false, a value must be supplied for either DurationInMinutes or EndDateTime. Supplying values in both fields is allowed if the values add up to the same amount of time. Depending on your API version, errors with the DurationInMinutes and EndDateTime fields may appear in different places. Versions 38.0 and beforeErrors always appear in the DurationInMinutes field. Versions 39.0 and laterIf there's no value for the DurationInMinutes field, errors appear in the EndDateTime field. Otherwise, they appear in the DurationInMinutes field.",
  },
  EventSubtype: {
    type: "string",
    label: "EventSubtype",
    description: "Provides standard subtypes to facilitate creating and searching for events. This field isn't updateable.",
  },
  EventWhoIds: {
    type: "string",
    label: "EventWhoIds",
    description: "A string array of contact or lead IDs used to create many-to-many relationships with a shared event. EventWhoIds is available when the shared activities setting is enabled. The first contact or lead ID in the list becomes the primary WhoId if you don't specify a primary WhoId. If you set the EventWhoIds field to null, all entries in the list are deleted and the value of WhoId is added as the first entry. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
  },
  IsAllDayEvent: {
    type: "boolean",
    label: "IsAllDayEvent",
    description: "Indicates whether the ActivityDate field (true) or the ActivityDateTime field (false) is used to define the date or time of the event. Label is All-Day Event. See also DurationInMinutes and EndDateTime.",
  },
  IsPrivate: {
    type: "boolean",
    label: "IsPrivate",
    description: "Indicates whether users other than the creator of the event can (false) or can't (true) see the event details when viewing the event user's calendar. However, users with the View All Data or Modify All Data permission can see private events in reports and searches, or when viewing other users' calendars. Private events can't be associated with opportunities, accounts, cases, campaigns, contracts, leads, or contacts. Label is Private.",
  },
  IsRecurrence: {
    type: "boolean",
    label: "IsRecurrence",
    description: "Indicates whether a Salesforce Classic event is scheduled to repeat itself (true) or only occurs once (false). This is a read-only field when updating records, but not when creating them. If this field value is true, then RecurrenceEndDateOnly, RecurrenceStartDateTime, RecurrenceType, and any recurrence fields associated with the given recurrence type must be populated. Label is Create recurring series of events.",
  },
  IsReminderSet: {
    type: "boolean",
    label: "IsReminderSet",
    description: "Indicates whether the activity is a reminder (true) or not (false).",
  },
  Location: {
    type: "string",
    label: "Location",
    description: "Contains the location of the event.",
  },
  OwnerId: {
    type: "string",
    label: "OwnerId",
    description: "Contains the ID of the user or public calendar who owns the event. Label is Assigned to ID.",
  },
  RecurrenceDayOfMonth: {
    type: "integer",
    label: "RecurrenceDayOfMonth",
    description: "Indicates the day of the month on which the event repeats.",
  },
  RecurrenceDayOfWeekMask: {
    type: "integer",
    label: "RecurrenceDayOfWeekMask",
    description: "Indicates the day or days of the week on which the Salesforce Classic recurring event repeats. This field contains a bitmask. The values are as follows: Sunday = 1 Monday = 2 Tuesday = 4 Wednesday = 8 Thursday = 16 Friday = 32 Saturday = 64 Multiple days are represented as the sum of their numerical values. For example, Tuesday and Thursday = 4 + 16 = 20.",
  },
  RecurrenceEndDateOnly: {
    type: "string",
    label: "RecurrenceEndDateOnly",
    description: "Indicates the last date on which the event repeats. For multiday Salesforce Classic recurring events, this is the day on which the last occurrence starts. This field is a date field with a timestamp that is always set to midnight in the Coordinated Universal Time (UTC) time zone. Don't attempt to alter the timestamp to account for time zone differences.",
  },
  RecurrenceInstance: {
    type: "string",
    label: "RecurrenceInstance",
    description: "Indicates the frequency of the Salesforce Classic event's recurrence. For example, 2nd or 3rd.",
  },
  RecurrenceInterval: {
    type: "integer",
    label: "RecurrenceInterval",
    description: "Indicates the interval between Salesforce Classic recurring events.",
  },
  RecurrenceMonthOfYear: {
    type: "string",
    label: "RecurrenceMonthOfYear",
    description: "Indicates the month in which the Salesforce Classic recurring event repeats.",
  },
  RecurrenceStartDateTime: {
    type: "string",
    label: "RecurrenceStartDateTime",
    description: "Indicates the date and time when the Salesforce Classic recurring event begins. The value must precede the RecurrenceEndDateOnly. The time portion of this field is always transferred in the Coordinated Universal Time (UTC) time zone. Translate the time portion to or from a local time zone for the user or the application, as appropriate.",
  },
  RecurrenceTimeZoneSidKey: {
    type: "string",
    label: "RecurrenceTimeZoneSidKey",
    description: "Indicates the time zone associated with a Salesforce Classic recurring event. For example, UTC-8:00 for Pacific Standard Time.",
  },
  RecurrenceType: {
    type: "string",
    label: "RecurrenceType",
    description: "Indicates how often the Salesforce Classic event repeats. For example, daily, weekly, or every nth month (where nth is defined in RecurrenceInstance).",
  },
  ReminderDateTime: {
    type: "string",
    label: "ReminderDateTime",
    description: "Represents the time when the reminder is scheduled to fire, if IsReminderSet is set to true. If IsReminderSet is set to false, then the user may have deselected the reminder checkbox in the Salesforce user interface, or the reminder has already fired at the time indicated by the value.",
  },
  ShowAs: {
    type: "string",
    label: "ShowAs",
    description: "Indicates how this event appears when another user views the calendar: Busy, Out of Office, or Free. Label is Show Time As.",
  },
  StartDateTime: {
    type: "string",
    label: "StartDateTime",
    description: "Indicates the start date and time of the event. Available in versions 13.0 and later.If the Event IsAllDayEvent flag is set to true (indicating that it is an all-day Event), then the event start date information is contained in the StartDateTime field. The time portion of this field is always transferred in the Coordinated Universal Time (UTC) time zone. Translate the time portion to or from a local time zone for the user or the application, as appropriate. If the Event IsAllDayEvent flag is set to false (indicating that it is not an all-day event), then the event start date information is contained in the StartDateTime field. The time portion is always transferred in the Coordinated Universal Time (UTC) time zone. You need to translate the time portion to or from a local time zone for the user or the application, as appropriate. If this field has a value, then ActivityDate and ActivityDateTime must either be null or match the value of this field.",
  },
  Subject: {
    type: "string",
    label: "Subject",
    description: "The subject line of the event, such as Call, Email, or Meeting. Limit: 255 characters.",
  },
  Type: {
    type: "string",
    label: "Type",
    description: "Indicates the event type, such as Call, Email, or Meeting.",
  },
  UndecidedEventInviteeIds: {
    type: "string",
    label: "UndecidedEventInviteeIds",
    description: "A string array of contact, lead, or user IDs who are undecided about this event. This JunctionIdList is linked to the UndecidedEventRelation child relationship. Warning Adding a JunctionIdList field name to the fieldsToNull property deletes all related junction records. This action can't be undone.",
  },
  WhatId: {
    type: "string",
    label: "WhatId",
    description: "The WhatId represents nonhuman objects such as accounts, opportunities, campaigns, cases, or custom objects. WhatIds are polymorphic. Polymorphic means a WhatId is equivalent to the ID of a related object. The label is Related To ID.",
  },
  WhoId: {
    type: "string",
    label: "WhoId",
    description: "The WhoId represents a human such as a lead or a contact. WhoIds are polymorphic. Polymorphic means a WhoId is equivalent to a contact's ID or a lead's ID. The label is Name ID.If Shared Activities is enabled, the value of this field is the ID of the related lead or primary contact. If you add, update, or remove the WhoId field, you might encounter problems with triggers, workflows, and data validation rules that are associated with the record. The label is Name ID. If the JunctionIdList field is used, all WhoIds are included in the relationship list. Beginning in API version 37.0, if the contact or lead ID in the WhoId field is not in the EventWhoIds list, no error occurs and the ID is added to the EventWhoIds as the primary WhoId. If WhoId is set to null, an arbitrary ID from the existing EventWhoIds list is promoted to the primary position.",
  },
};
