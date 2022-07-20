import { JSONValue } from "@pipedream/types";

type asyncOptionsObject = {
  label: string;
  value: any;
};

type hookNewObject = {
  info: {
    [key: string]: JSONValue;
  };
  summary: string;
};

export { asyncOptionsObject, hookNewObject };
