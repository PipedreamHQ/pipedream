const dayjs = require("dayjs");

// See: https://www.supersaas.com/info/dev/webhooks
module.exports = function makeEventSummary(ev) {
  const withUserEmail = (x) => {
    if (!ev.body.email) {
      return x;
    }

    return `${x} (${ev.body.email})`;
  };

  const withStartDateTime = (x) => {
    const start = ev.body.slot
      ? ev.body.slot.start
      : ev.body.start;

    if (!start) {
      return x;
    }

    return `${x} for ${dayjs(start).format("YYYY-MM-DD [at] HH:mm")}`;
  };

  switch (ev.body.event) {
  // User events:
  case "new":
    return withUserEmail("New user");

  case "change":
    if (ev.body.deleted) {
      return withUserEmail("Deleted user");
    }

    return withUserEmail("Changed user");

  case "delete":
    return withUserEmail("Deleted user");

  case "purchase":
    return withUserEmail("Purchased credit");

    // Appointment events:
  case "create":
    return withStartDateTime("Created an appointment");

  case "edit":
    return withStartDateTime(
      ev.body.deleted
        ? "Deleted an appointment"
        : "Changed an appointment",
    );

  case "destroy":
    return withStartDateTime("Deleted an appointment");

  default:
    console.log("Unsupported event:", ev.body.event);
    return null;
  }
};
