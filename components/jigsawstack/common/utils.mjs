import { ConfigurationError } from "@pipedream/platform";

export const throwError = ({ message }) => {
  const errorMessage = JSON.parse(message).message;
  throw new ConfigurationError(errorMessage);
};

export const checkTmp = (filename) => {
  if (!filename.startsWith("/tmp")) {
    return `/tmp/${filename}`;
  }
  return filename;
};
