import { ConfigurationError } from "@pipedream/platform";

// Builds the `to` object for POST /conversations and /conversations/sendMessage.
// An email recipient takes precedence over a contact ID.
// https://developers.belco.io/reference/post_conversations
export const buildRecipient = ({
  to, toType, toEmail, channel,
}) => {
  if (toEmail) {
    if (channel !== "email") {
      throw new ConfigurationError("`To Email` can only be used with the `email` channel.");
    }
    return {
      type: toType || "customer",
      email: toEmail,
    };
  }
  if (to) {
    return {
      type: toType || "contact",
      _id: to,
    };
  }
  throw new ConfigurationError("Provide either `To` (a Belco contact ID) or `To Email`.");
};
