const MAX_RESOURCES = 800;
const LIMIT = 250;

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

const CHANNEL_TYPES_OPTIONS = [
  {
    label: "Public Channels",
    value: CHANNEL_TYPE.PUBLIC,
  },
  {
    label: "Private Channels",
    value: CHANNEL_TYPE.PRIVATE,
  },
  {
    label: "Direct Messages",
    value: CHANNEL_TYPE.IM,
  },
  {
    label: "Group Messages",
    value: CHANNEL_TYPE.MPIM,
  },
];

export default {
  MAX_RESOURCES,
  LIMIT,
  CHANNEL_TYPE,
  CHANNEL_TYPE_OPTIONS,
  CHANNEL_TYPES_OPTIONS,
};
