/**
 * Format a number of seconds into a time elapsed string
 *
 * @example
 * // returns "15s"
 * formatTimeElapsed(15);
 *
 * @example
 * // returns "35min"
 * formatTimeElapsed(60 * 35.5);
 *
 * @param {Number} seconds - the number of seconds
 * @returns the formatted time elapsed string
 */
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
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "min";
  }
  return Math.floor(seconds) + "s";
}

/**
 * Get the time between two dates as a time-elapsed string
 *
 * @param {Date} date1 the earlier date
 * @param {Date} date2 the later date
 * @returns the time elapsed between two dates
 */
function timeBetween(date1, date2) {
  var seconds = Math.floor((date2 - date1) / 1000);

  return formatTimeElapsed(seconds);
}

/**
 * Return a copy of `obj` with properties omitted whose value is an empty string
 *
 * @param {Object} obj - the base object
 * @returns the new object
 */
function omitEmptyStringValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter((kVpair) => kVpair[1] !== ""),
  );
}

/**
 * Return `value` if `condition` or an empty string otherwise
 *
 * @param {*} condition - the condition
 * @param {*} value - the value to conditionally return
 * @returns the value, if the condition is true, and empty string otherwise
 */
function valueOrEmptyString(condition, value) {
  return condition
    ? value
    : "";
}

/**
 * Format a date as a human-readable string
 *
 * @example
 * // returns "2021-10-01"
 * formatDateString("2021-10-01T01:06:45.000Z");
 *
 * @param {Date|String} date - the date to format
 * @returns the formatted date string
 */
function formatDateString(date) {
  const dateObj = new Date(date);
  return dateObj.toISOString().split("T")[0];
}

/**
 * Format a [Twilio Call object]{@link https://www.twilio.com/docs/voice/api/call-resource} as a
 * string
 *
 * @param {Object} call - The Twilio Call object
 * @returns the string representing a call
 */
function callToString(call) {
  const fromPart = valueOrEmptyString(call.fromFormatted, call.fromFormatted);
  const toPart = valueOrEmptyString(call.toFormatted, ` to ${call.toFormatted}`);
  const datePart = valueOrEmptyString(call.startTime, ` on ${formatDateString(call.startTime)}`);
  const durationPart = valueOrEmptyString(call.duration, ` for ${formatTimeElapsed(call.duration)}`);
  return fromPart + toPart + datePart + durationPart;
}

/**
 * Format a [Twilio Message object]{@link https://www.twilio.com/docs/sms/api/message-resource} as a
 * string
 *
 * @param {Object} call - The Twilio Message object
 * @returns the string representing a message
 */
function messageToString(message) {
  const MAX_LENGTH = 30;
  const messageText = message.body.length > MAX_LENGTH
    ? `${message.body.slice(0, MAX_LENGTH)}...`
    : message.body; // truncate long text
  const messageDate = message.dateSent || message.dateCreated;
  const dateString = formatDateString(messageDate);
  return `${message.from} to ${message.to} on ${dateString}: ${messageText}`;
}

/**
 * Format a [Twilio Recording object]{@link https://www.twilio.com/docs/voice/api/recording} as a
 * string
 *
 * @param {Object} call - The Twilio Recording object
 * @returns the string representing a recording
 */
function recordingToString(recording) {
  const datePart = valueOrEmptyString(recording.startTime, ` ${formatDateString(recording.startTime)}`);
  const durationPart = valueOrEmptyString(recording.duration, ` - ${formatTimeElapsed(recording.duration)}`);
  return datePart + durationPart;
}

export {
  timeBetween,
  omitEmptyStringValues,
  callToString,
  messageToString,
  recordingToString,
};
