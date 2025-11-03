const DEFAULT_DOCS =
  "https://developers.google.com/google-ads/api/reference/rpc/v21/UserList";

export const getAdditionalFields = (docsLink = DEFAULT_DOCS) => ({
  type: "object",
  label: "Additional Fields",
  description: `Additional fields and values to be created. [See the documentation](${docsLink}) for available fields. Values will be parsed as JSON where applicable.`,
  optional: true,
});

export const getListTypeInfo = (docsLink = DEFAULT_DOCS) => ({
  type: "alert",
  alertType: "info",
  content: `[See the documentation](${docsLink}) for more information on this type of customer list.`,
});
