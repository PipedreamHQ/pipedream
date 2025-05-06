export const mcpNotificationPayload = (props: {
  method: string
  params?: { [key: string]: unknown }
}) => {
  return {
    jsonrpc: "2.0",
    ...props,
  }
}
