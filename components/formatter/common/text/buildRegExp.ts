import { ConfigurationError } from "@pipedream/platform";

export default function (str: string, defaultFlags?: string[]) {
  let flags = defaultFlags?.join("") ?? "";
  if (str.startsWith("/")) {
    const end = str.match(/\/[a-z]*$/);
    if (!end) {
      throw new ConfigurationError("Parse error - invalid regular expression.");
    }
    str = str.slice(1, end.length * -1);

    flags = end[0].split("/")[1];
    defaultFlags?.forEach((flag) => {
      if (!flags.includes(flag)) flags += flag;
    });
  }
  return new RegExp(str, flags);
}
