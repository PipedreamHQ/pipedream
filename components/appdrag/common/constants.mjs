const FUNCTION_PLACEHOLDER = "{fnName}";
const APP_ID_PLACEHOLDER = "{appId}";

const URL = {
  BACKEND: "https://api.appdrag.com/CloudBackend.aspx",
  FUNCTION: `https://${APP_ID_PLACEHOLDER}.appdrag.site/api${FUNCTION_PLACEHOLDER}`,
};

const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export default {
  FUNCTION_PLACEHOLDER,
  APP_ID_PLACEHOLDER,
  URL,
  HTTP_METHOD,
};
