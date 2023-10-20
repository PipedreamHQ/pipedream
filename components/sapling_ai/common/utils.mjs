import { v4 as uuid } from "uuid";

function generateSessionId(sessionId) {
  return sessionId || uuid();
}

export default {
  generateSessionId,
};
