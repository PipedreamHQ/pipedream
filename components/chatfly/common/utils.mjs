export const prepareSessionLabel = (messages) => {
  return `${messages[messages.length - 1].content.substring(0, 60)} ${(messages[messages.length - 1].content.length > 60)
    ? "..."
    : ""}`;
};
