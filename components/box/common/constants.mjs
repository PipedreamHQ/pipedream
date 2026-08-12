export default {
  pageSize: 100,
  searchTypes: [
    {
      label: "Files",
      value: "file",
    },
    {
      label: "Folders",
      value: "folder",
    },
    {
      label: "Web Links",
      value: "web_link",
    },
  ],
  collaborationRoles: [
    {
      label: "Editor",
      value: "editor",
    },
    {
      label: "Viewer",
      value: "viewer",
    },
    {
      label: "Previewer",
      value: "previewer",
    },
    {
      label: "Uploader",
      value: "uploader",
    },
    {
      label: "Previewer Uploader",
      value: "previewer uploader",
    },
    {
      label: "Viewer Uploader",
      value: "viewer uploader",
    },
    {
      label: "Co-owner",
      value: "co-owner",
    },
  ],
  sharedLinkAccessLevels: [
    {
      label: "Open (anyone with the link)",
      value: "open",
    },
    {
      label: "Company (enterprise users only)",
      value: "company",
    },
    {
      label: "Collaborators only",
      value: "collaborators",
    },
  ],
  itemTypes: [
    {
      label: "File",
      value: "file",
    },
    {
      label: "Folder",
      value: "folder",
    },
  ],
  accessibleByTypes: [
    {
      label: "User",
      value: "user",
    },
    {
      label: "Group",
      value: "group",
    },
  ],
};
