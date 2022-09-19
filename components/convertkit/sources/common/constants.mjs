export default {
  WEBHOOK_EVENTS: [
    {
      label: "On form subscription",
      value: "subscriber.form_subscribe",
      additionalProps: [
        "form",
      ],
    },
    {
      label: "On course subscription",
      value: "subscriber.course_subscribe",
      additionalProps: [
        "course",
      ],
    },
    {
      label: "On course completion",
      value: "subscriber.course_complete",
      additionalProps: [
        "course",
      ],
    },
    {
      label: "On link clicked",
      value: "subscriber.link_click",
      additionalProps: [
        "initiator",
      ],
    },
    {
      label: "On tag added",
      value: "subscriber.tag_add",
      additionalProps: [
        "tag",
      ],
    },
    {
      label: "On tag removed",
      value: "subscriber.tag_remove",
      additionalProps: [
        "tag",
      ],
    },
    {
      label: "On purchase created",
      value: "purchase.purchase_create",
    },
  ],
};
