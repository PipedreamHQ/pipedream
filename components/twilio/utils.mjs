function formatTimeElapsed(seconds) {
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function timeBetween(date1, date2) {
  var seconds = Math.floor((date2 - date1) / 1000);

  return formatTimeElapsed(seconds);
}

function omitEmptyStringValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter((kVpair) => kVpair[1] !== ""),
  );
}

export {
  formatTimeElapsed,
  timeBetween,
  omitEmptyStringValues,
};
