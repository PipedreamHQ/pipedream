import { ConfigurationError } from "@pipedream/platform";

export default function (str: string, defaultFlags?: string[]) {
  const end = str.match(/\/[a-z]*$/);
  if (!end) {
    throw new ConfigurationError("Parse error - invalid regular expression.");
  }

  str = str.slice(1, end[0].length * -1);

  let flags = end[0].split("/")[1] ?? "";
  defaultFlags?.forEach((flag) => {
    if (!flags.includes(flag)) flags += flag;
  });

  return new RegExp(str, flags);
}
