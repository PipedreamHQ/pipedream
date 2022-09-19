const PRIORITY = {
  LOWEST: -2,
  LOW: -1,
  DEFAULT: 0,
  HIGH: 1,
  EMERGENCY: 2,
}

const PRIORITY_OPTIONS = [
  {
    value: PRIORITY.LOWEST,
    label: "Lowest, no alert",
  },
  {
    value: PRIORITY.LOW,
    label: "Low, no sound",
  },
  {
    value: PRIORITY.DEFAULT,
    label: "Normal priority",
  },
  {
    value: PRIORITY.HIGH,
    label: "High priority, bypass quiet hours",
  },
  {
    value: PRIORITY.EMERGENCY,
    label: "Emergency priority, bypass quiet hours, and repeat until the notification is acknowledged by user",
  },
]

export default {
  BASE_PATH: "https://api.pushover.net/1",
  PATH_SUFFIX: ".json",
  PRIORITY,
  PRIORITY_OPTIONS,
}
