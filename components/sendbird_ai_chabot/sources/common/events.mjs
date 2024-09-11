export default [
  {
    value: "open_channel:create",
    label: "open channel created",
  },
  {
    value: "open_channel:remove",
    label: "open channel removed",
  },
  {
    value: "open_channel:enter",
    label: "user enters open channel",
  },
  {
    value: "open_channel:exit",
    label: "user exits open channel",
  },
  {
    value: "open_channel:message_send",
    label: "message sent within open channel",
  },
  {
    value: "open_channel:message_update",
    label: "message updated in open channel",
  },
  {
    value: "open_channel:message_delete",
    label: "message deleted from open channel",
  },
  {
    value: "group_channel:create",
    label: "group channel created",
  },
  {
    value: "group_channel:changed",
    label: "group information changed",
  },
  {
    value: "group_channel:remove",
    label: "group channel removed",
  },
  {
    value: "group_channel:invite",
    label: "user invites another user to group channel",
  },
  {
    value: "group_channel:decline_invite",
    label: "user declines invitation to group channel",
  },
  {
    value: "group_channel:join",
    label: "user joins group channel",
  },
  {
    value: "group_channel:leave",
    label: "user leaves group channel",
  },
  {
    value: "group_channel:message_send",
    label: "message sent within group channel",
  },
  {
    value: "group_channel:message_read",
    label: "user has no more unread messages in group channel",
  },
  {
    value: "group_channel:message_update",
    label: "message updated in group channel",
  },
  {
    value: "group_channel:message_delete",
    label: "message deleted from group channel",
  },
  {
    value: "group_channel:freeze_unfreeze",
    label: "group channel frozen or unfrozen",
  },
  {
    value: "group_channel:reaction_add",
    label: "user adds reactions to group channel message",
  },
  {
    value: "group_channel:reaction_delete",
    label: "user deletes reactions from group channel message",
  },
  {
    value: "user:block",
    label: "user blocks another user",
  },
  {
    value: "user:unblock",
    label: "user unblocks another user",
  },
  {
    value: "operators:register_by_operator",
    label: "operator registered by another operator's client app",
  },
  {
    value: "operators:unregister_by_operator",
    label: "operator registration canceled by another operator's client app",
  },
  {
    value: "message:report",
    label: "message reported by user",
  },
  {
    value: "user:report",
    label: "user reported by user",
  },
  {
    value: "open_channel:report",
    label: "open channel reported by user",
  },
  {
    value: "group_channel:report",
    label: "group channel reported by user",
  },
  {
    value: "alert:user_message_rate_limit_exceeded",
    label: "user exceeds allowed number of messages",
  },
  {
    value: "profanity_filter:replace",
    label: "explicit words replaced with asterisks (*)",
  },
  {
    value: "profanity_filter:block",
    label: "message with explicit words blocked",
  },
  {
    value: "profanity_filter:moderate",
    label: "user muted, kicked, or banned",
  },
  {
    value: "image_moderation:block",
    label: "message with explicit image blocked",
  },
  {
    value: "announcement:create_channels",
    label: "channel created for sending announcement to target users",
  },
  {
    value: "announcement:send_messages",
    label: "announcement message sent to target channels and users",
  },
];
