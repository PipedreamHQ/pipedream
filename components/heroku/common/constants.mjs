const ENTITIES = [
  {
    value: "api:addon-attachment",
    label: "addon-attachment - An add-on has been attached or removed from the app",
  },
  {
    value: "api:addon",
    label: "addon - An add-on for the app has been newly provisioned or deleted, or its details have been modified",
  },
  {
    value: "api:app",
    label: "app - The app itself has been provisioned or deleted, or its details have been modified",
  },
  {
    value: "api:build",
    label: "build - A new build for the app has been initiated or the build’s status has changed since the last notification",
  },
  {
    value: "api:collaborator",
    label: "collaborator - A collaborator has been added or removed from the app, or an existing collaborator’s details have been modified",
  },
  {
    value: "api:domain",
    label: "domain - Custom domain details have been added or removed from the app",
  },
  {
    value: "api:dyno",
    label: "dyno - A new dyno has begun running for the app",
  },
  {
    value: "api:formation",
    label: "formation - The dyno formation for a particular process type has been modified",
  },
  {
    value: "api:release",
    label: "release - A new release for the app has been initiated or the release’s status has changed since the last notification",
  },
  {
    value: "api:sni-endpoint",
    label: "sni-endpoint - An SNI endpoint has been specified or removed for the app, or the existing SNI endpoint’s details have been modified",
  },
];

export default {
  ENTITIES,
};
