import {
  get, isEmpty, isString,
} from "lodash-es";
import { JSONValue } from "@pipedream/types";

export function sanitize(value: JSONValue) {
  if (Array.isArray(value)) {
    return value.map((item: any) => get(item, "value", item));
  }

  // If is string, try to convert it in an array
  if (isString(value)) {
    // Return an empty array if string is empty
    if (isEmpty(value)) {
      return [];
    }

    return value
      // Remove square brackets from ends ([ "foo", 5 ] ->  "foo", 5 )
      .replace(/(^\[)|(]$)/g, "")
      .trim() // ( "foo", 5  -> "foo", 5)
      // Remove quotes from ends ("foo", 5  ->  foo", 5)
      .replace(/^["']|["']$/g, "")
      // Split on quotes, whitespace, and comma (foo", 5 ->  ["foo","5"])
      .split(/["']?\s*,\s*["']?/);
  }

  throw new Error(`${value} is not an array or an array-like`);
}

