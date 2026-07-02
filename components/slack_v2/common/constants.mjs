const MAX_RESOURCES = 800;
const LIMIT = 250;
// Caps `users.list` pagination in name lookups, since unresolvable ids (e.g.
// external Slack Connect users) would otherwise force a full directory scan
// and exhaust the method's rate limit.
const MAX_NAME_LOOKUP_PAGES = 5;

const CHANNEL_TYPE = {
  PUBLIC: "public_channel",
  PRIVATE: "private_channel",
  MPIM: "mpim",
  IM: "im",
};

const CHANNEL_TYPE_OPTIONS = [
  {
    label: "Channels",
    value: "Channels",
  },
  {
    label: "Group",
    value: CHANNEL_TYPE.MPIM,
  },
  {
    label: "User / Direct Message",
    value: CHANNEL_TYPE.IM,
  },
];

export default {
  MAX_RESOURCES,
  LIMIT,
  MAX_NAME_LOOKUP_PAGES,
  CHANNEL_TYPE,
  CHANNEL_TYPE_OPTIONS,
};
