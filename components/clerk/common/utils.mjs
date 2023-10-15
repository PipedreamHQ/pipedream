import { ConfigurationError } from "@pipedream/platform";

export const LIMIT = 500;

export const parseObject = (obj) => {
  if (obj && (typeof obj !=  "object")) {
    return JSON.parse(obj);
  }
  return obj;
};

export const parseError = ({ response: { data } }) => {
  const error = data.errors[0];
  let errorMessage = `\`${error.meta.param_name || error.meta.param_names[0]}\``;

  switch (error.code) {
  case "form_param_unknown" : errorMessage = `${errorMessage} is disabled in the account settings. Please enable this property or remove it from this request.`; break;
  case "form_data_missing" : errorMessage = `${errorMessage} is marked as required in the account settings. Please unmark this property as required or add it to this request.`; break;
  default: errorMessage = error.long_message;
  }
  throw new ConfigurationError(errorMessage);
};
