import constants from "./constants.mjs";

function isRejected(data) {
  return [
    data?.event,
    data?.ordStatus,
  ].includes(constants.EVENT.REJECTED);
}

export default {
  isRejected,
};
