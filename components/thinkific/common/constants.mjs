const ROLES = [
  "affiliate",
  "course_admin",
  "group_analyst",
  "site_admin",
];

const AFFILIATE_COMMISSION_TYPES = [
  "%",
  "$",
];

const TOPIC_OPTIONS = [
  {
    label: "Lead Created",
    value: "lead.created",
  },
  {
    label: "Order Created",
    value: "order.created",
  },
  {
    label: "Order Transition - Succeeded",
    value: "order_transaction.succeeded",
  },
  {
    label: "Order Transition - Failed",
    value: "order_transaction.failed",
  },
  {
    label: "Order Transition - Refunded",
    value: "order_transaction.refunded",
  },
  {
    label: "Subscription - Cancelled",
    value: "subscription.cancelled",
  },
  {
    label: "Subscription - Past Due",
    value: "subscription.past_due",
  },
  {
    label: "Subscription - Unpaid",
    value: "subscription.unpaid",
  },
  {
    label: "User - Signup",
    value: "user.signup",
  },
  {
    label: "User - Signin",
    value: "user.signin",
  },
  {
    label: "User - Updated",
    value: "user.updated",
  },
  {
    label: "Enrollment - Trial",
    value: "enrollment.trial",
  },
  {
    label: "Enrollment - Created",
    value: "enrollment.created",
  },
  {
    label: "Enrollment - Completed",
    value: "enrollment.completed",
  },
  {
    label: "Enrollment - Progress",
    value: "enrollment.progress",
  },
  {
    label: "Course - Created",
    value: "course.created",
  },
  {
    label: "Course - Deleted",
    value: "course.deleted",
  },
  {
    label: "Course - Updated",
    value: "course.updated",
  },
  {
    label: "Lesson - Completed",
    value: "lesson.completed",
  },
  {
    label: "Quiz - Attempted",
    value: "quiz.attempted",
  },
  {
    label: "App - Uninstalled",
    value: "app.uninstalled",
  },
  {
    label: "Product - Created",
    value: "product.created",
  },
  {
    label: "Product - Deleted",
    value: "product.deleted",
  },
  {
    label: "Product - Updated",
    value: "product.updated",
  },
  {
    label: "Plan - Updated",
    value: "plan.updated",
  },
];

export default {
  ROLES,
  AFFILIATE_COMMISSION_TYPES,
  TOPIC_OPTIONS,
};
