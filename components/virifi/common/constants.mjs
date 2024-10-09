const BASE_URL = "https://virifi.io";
const VERSION_PATH = "/api/developer";

const SIGN_BY_OPTION = {
  SIGN_BY_YOURSELF: {
    label: "Sing By Yourself",
    value: "signByYourself",
  },
  SIGN_AND_INVITE_OTHERS: {
    label: "Sign And Invite Others",
    value: "signAndInviteOthers",
  },
  SIGN_OTHER: {
    label: "Sign Other",
    value: "signOther",
  },
};

const SIGNATURE_TYPE_OPTION = {
  AES: "AES",
  PES: "PES",
};

export default {
  BASE_URL,
  VERSION_PATH,
  SIGN_BY_OPTION,
  SIGNATURE_TYPE_OPTION,
};
