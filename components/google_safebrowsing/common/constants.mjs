const THREAT_TYPES = [
  {
    value: "THREAT_TYPE_UNSPECIFIED",
    label: "Unknown",
  },
  {
    value: "MALWARE",
    label: "Malware threat type",
  },
  {
    value: "SOCIAL_ENGINEERING",
    label: "Social engineering threat type",
  },
  {
    value: "UNWANTED_SOFTWARE",
    label: "Unwanted software threat type",
  },
  {
    value: "POTENTIALLY_HARMFUL_APPLICATION",
    label: "Potentially harmful application threat type",
  },
];

const PLATFORM_TYPES = [
  {
    value: "PLATFORM_TYPE_UNSPECIFIED",
    label: "Unknown platform",
  },
  {
    value: "WINDOWS",
    label: "Threat posed to Windows",
  },
  {
    value: "LINUX",
    label: "Threat posed to Linux",
  },
  {
    value: "ANDROID",
    label: "Threat posed to Android",
  },
  {
    value: "OSX",
    label: "Threat posed to OS X",
  },
  {
    value: "IOS",
    label: "Threat posed to iOS",
  },
  {
    value: "ANY_PLATFORM",
    label: "Threat posed to at least one of the defined platforms",
  },
  {
    value: "ALL_PLATFORMS",
    label: "Threat posed to all defined platforms",
  },
  {
    value: "CHROME",
    label: "Threat posed to Chrome",
  },
];

const THREAT_ENTRY_TYPES = [
  {
    value: "THREAT_ENTRY_TYPE_UNSPECIFIED",
    label: "Unspecified",
  },
  {
    value: "URL",
    label: "A URL",
  },
  {
    value: "EXECUTABLE",
    label: "An executable program",
  },
];

export default {
  THREAT_TYPES,
  PLATFORM_TYPES,
  THREAT_ENTRY_TYPES,
};
