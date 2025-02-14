const VERSION_PATH = "v3";

const ACTIVITY_TYPE = {
  MESSAGE: "message",
  CONTACT_RELATION_UPDATE: "contactRelationUpdate",
  CONVERSATION_UPDATE: "conversationUpdate",
  TYPING: "typing",
  END_OF_CONVERSATION: "endOfConversation",
  EVENT: "event",
  INVOKE: "invoke",
  DELETE_USER_DATA: "deleteUserData",
  MESSAGE_UPDATE: "messageUpdate",
  MESSAGE_DELETE: "messageDelete",
  INSTALLATION_UPDATE: "installationUpdate",
  MESSAGE_REACTION: "messageReaction",
  SUGGESTION: "suggestion",
  TRACE: "trace",
  HANDOFF: "handoff",
};

export default {
  VERSION_PATH,
  ACTIVITY_TYPE,
};
