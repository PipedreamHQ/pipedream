const WEBHOOK_ID = "webhookId";

const WEBHOOK_EVENT_OPTIONS = [
  {
    label: "Checkout Created",
    value: "checkout.created",
  },
  {
    label: "Checkout Updated",
    value: "checkout.updated",
  },
  {
    label: "Customer Created",
    value: "customer.created",
  },
  {
    label: "Customer Updated",
    value: "customer.updated",
  },
  {
    label: "Customer Deleted",
    value: "customer.deleted",
  },
  {
    label: "Customer State Changed",
    value: "customer.state_changed",
  },
  {
    label: "Customer Seat Assigned",
    value: "customer_seat.assigned",
  },
  {
    label: "Customer Seat Claimed",
    value: "customer_seat.claimed",
  },
  {
    label: "Customer Seat Revoked",
    value: "customer_seat.revoked",
  },
  {
    label: "Order Created",
    value: "order.created",
  },
  {
    label: "Order Updated",
    value: "order.updated",
  },
  {
    label: "Order Paid",
    value: "order.paid",
  },
  {
    label: "Order Refunded",
    value: "order.refunded",
  },
  {
    label: "Subscription Created",
    value: "subscription.created",
  },
  {
    label: "Subscription Updated",
    value: "subscription.updated",
  },
  {
    label: "Subscription Active",
    value: "subscription.active",
  },
  {
    label: "Subscription Canceled",
    value: "subscription.canceled",
  },
  {
    label: "Subscription Uncanceled",
    value: "subscription.uncanceled",
  },
  {
    label: "Subscription Revoked",
    value: "subscription.revoked",
  },
  {
    label: "Subscription Past Due",
    value: "subscription.past_due",
  },
  {
    label: "Refund Created",
    value: "refund.created",
  },
  {
    label: "Refund Updated",
    value: "refund.updated",
  },
  {
    label: "Product Created",
    value: "product.created",
  },
  {
    label: "Product Updated",
    value: "product.updated",
  },
  {
    label: "Benefit Created",
    value: "benefit.created",
  },
  {
    label: "Benefit Updated",
    value: "benefit.updated",
  },
  {
    label: "Benefit Grant Created",
    value: "benefit_grant.created",
  },
  {
    label: "Benefit Grant Cycled",
    value: "benefit_grant.cycled",
  },
  {
    label: "Benefit Grant Updated",
    value: "benefit_grant.updated",
  },
  {
    label: "Benefit Grant Revoked",
    value: "benefit_grant.revoked",
  },
  {
    label: "Organization Updated",
    value: "organization.updated",
  },
];

export default {
  WEBHOOK_ID,
  WEBHOOK_EVENT_OPTIONS,
};
