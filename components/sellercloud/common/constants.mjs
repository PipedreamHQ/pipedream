const DEFAULT_PAGE_SIZE = 50;

const ORDER_STATUS_OPTIONS = [
  {
    label: "Canceled",
    value: "-1",
  },
  {
    label: "Shopping Cart",
    value: "1",
  },
  {
    label: "In Process",
    value: "2",
  },
  {
    label: "Completed",
    value: "3",
  },
  {
    label: "Problem Order",
    value: "100",
  },
  {
    label: "On Hold",
    value: "200",
  },
  {
    label: "Quote",
    value: "300",
  },
  {
    label: "Void",
    value: "999",
  },
];

const ADJUSTMENT_TYPE_OPTIONS = [
  {
    label: "Add",
    value: "1",
  },
  {
    label: "Subtract",
    value: "0",
  },
];

export default {
  DEFAULT_PAGE_SIZE,
  ORDER_STATUS_OPTIONS,
  ADJUSTMENT_TYPE_OPTIONS,
};
