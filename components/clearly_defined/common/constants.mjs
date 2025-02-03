const COMPONENT_TYPES = [
  "composer",
  "conda",
  "condasrc",
  "crate",
  "deb",
  "debsrc",
  "gem",
  "git",
  "go",
  "maven",
  "npm",
  "nuget",
  "pod",
  "pypi",
  "sourcearchive",
];

const COMPONENT_PROVIDERS = [
  "anaconda-main",
  "anaconda-r",
  "cocoapods",
  "conda-forge",
  "cratesio",
  "debian",
  "github",
  "gitlab",
  "mavencentral",
  "mavengoogle",
  "gradleplugin",
  "npmjs",
  "nuget",
  "packagist",
  "pypi",
  "rubygems",
];

const SORT_FIELDS = [
  "type",
  "provider",
  "namespace",
  "name",
  "revision",
  "license",
  "releaseDate",
  "licensedScore",
  "describedScore",
  "effectiveScore",
  "toolScore",
];

const SORT_DIRECTIONS = [
  "ascending",
  "descending",
];

const RESPONSE_FORMS = [
  {
    label: "summarize harvested file",
    value: "summary",
  },
  {
    label: "raw content of the harvested file",
    value: "raw",
  },
  {
    label: "streamed content of the harvested file",
    value: "streamed",
  },
  {
    label: "List of matching harvested files",
    value: "list",
  },
];

export default {
  COMPONENT_TYPES,
  COMPONENT_PROVIDERS,
  SORT_FIELDS,
  SORT_DIRECTIONS,
  RESPONSE_FORMS,
};
