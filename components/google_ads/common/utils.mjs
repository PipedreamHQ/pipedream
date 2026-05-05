import { ConfigurationError } from "@pipedream/platform";

export function parseObject(value = {}) {
  return Object.fromEntries(Object.entries(value).map(([
    key,
    value,
  ]) => {
    try {
      return [
        key,
        JSON.parse(value),
      ];
    } catch (err) {
      return [
        key,
        value,
      ];
    }
  }));
}

export function parseStringObject(value = "{}") {
  try {
    return typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch (err) {
    throw new ConfigurationError(`Error parsing JSON value \`${value}\`
\\
**${err.toString()}**`);
  }
}

export function getOption(label, prefix) {
  return {
    label,
    value: `${prefix}.${label}`,
  };
}

export function getResourceOption(item, resource) {
  let label, value;
  switch (resource) {
  case "campaign":
    label = item.campaign.name;
    value = item.campaign.id;
    break;

  case "customer":
    label = item.customer.descriptiveName;
    value = item.customer.id;
    break;

  case "ad_group":
    label = item.adGroup.name;
    value = item.adGroup.id;
    break;

  case "ad_group_ad":
    label = item.adGroupAd.ad.name;
    value = item.adGroupAd.ad.id;
    break;
  }

  return {
    label,
    value,
  };
}

export function checkPrefix(value, prefix) {
  const checkStr = (s) => s && (s?.startsWith?.(prefix)
    ? s
    : `${prefix}.${s}`);
  return Array.isArray(value ?? [])
    ? (value ?? []).map(checkStr)
    : checkStr(value);
}
