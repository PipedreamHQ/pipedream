const SHARING_LINK_TYPE_OPTIONS = [
  {
    label: "Create a read-only link to the DriveItem",
    value: "view",
  },
  {
    label: "Create a read-write link to the DriveItem",
    value: "edit",
  },
  {
    label: "Create an embeddable link to the DriveItem. Only available for files in OneDrive personal.",
    value: "embed",
  },
];

const SHARING_LINK_SCOPE_OPTIONS = [
  {
    label: "Anyone with the link has access, without needing to sign in",
    value: "anonymous",
  },
  {
    label: "Anyone signed into your organization can use the link. Only available in OneDrive for Business and SharePoint.",
    value: "organization",
  },
];

export default {
  SHARING_LINK_TYPE_OPTIONS,
  SHARING_LINK_SCOPE_OPTIONS,
};
