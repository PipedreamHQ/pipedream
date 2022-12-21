const CONTACT = [
  "_id",
  "userId",
  "email",
  "name",
  "timestamp",
  "usedCount",
  "contactId",
  "salesforceId",
  "analytics",
  "locked",
];

const DATES = [
  "today",
  "yesterday",
  "last7",
  "thisWeek",
  "lastWeek",
  "last30",
  "thisMonth",
  "lastMonth",
  "last12Months",
  "thisYear",
  "lastYear",
  "allTime",
  "specific",
];

const EXPAND = [
  "firstName",
  "lastName",
  "groups",
  "notes",
  "salesforce",
];

const GROUPS = [
  "_id",
  "userId",
  "groupId",
  "name",
  "count",
  "shared",
];

const SORTCONTACT = [
  "email",
  "name",
  "timestamp",
  "usedCount",
];

export default {
  CONTACT,
  DATES,
  EXPAND,
  GROUPS,
  SORTCONTACT,
};
