export function parseJSON(json) {
  return json && typeof json === "string"
    ? JSON.parse(json)
    : json;
}
