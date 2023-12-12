const NOTIFICATION_TYPES = [
  "Expense added",
  "Expense updated",
  "Expense deleted",
  "Comment added",
  "Added to group",
  "Removed from group",
  "Group deleted",
  "Group settings changed",
  "Added as friend",
  "Removed as friend",
  "News (a URL should be included)",
  "Debt simplification",
  "Group undeleted",
  "Expense undeleted",
  "Group currency conversion",
  "Friend currency conversion",
];

const HTML_TAGS = [
  "</?strong>",
  "</?strike>",
  "</?small>",
  "</?br>",
  "</?font.*>", // greedily removes "You owe / get back" part
];

export default {
  NOTIFICATION_TYPES,
  HTML_TAGS,
};
