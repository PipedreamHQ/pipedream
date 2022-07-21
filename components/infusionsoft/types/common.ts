import { JSONValue } from "@pipedream/types";

type asyncOptionsObject = {
  label: string;
  value: any;
};

type webhookNewObjectData = {
  info: {
    [key: string]: JSONValue;
  };
  summary: string;
};

export { asyncOptionsObject, webhookNewObjectData };
