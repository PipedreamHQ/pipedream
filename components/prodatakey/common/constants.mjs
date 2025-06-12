export const EVENT_OPTIONS =
[
  {
    label: "Triggers when a controller's relay circuits stabilize.",
    value: "device.alarm.circuitbreaker.off",
  },
  {
    label: "Triggers when a controller's relay circuits become unstable (e.g. due to loose wires).",
    value: "device.alarm.circuitbreaker.on",
  },
  {
    label: "Triggers when a device equipped with a door position sensor (DPS) is forced open.",
    value: "device.alarm.forced",
  },
  {
    label: "Triggers when a forced alarm has cleared.",
    value: "device.alarm.forced.cleared",
  },
  {
    label: "Triggers when prop alarms are cleared for all devices.",
    value: "device.alarm.propped.alloff",
  },
  {
    label: "Triggers when a prop alarm has cleared for a device.",
    value: "device.alarm.propped.off",
  },
  {
    label: "Triggers when a device equipped with a door position sensor (DPS) is propped open.",
    value: "device.alarm.propped.on",
  },
  {
    label: "Triggers when auto open is deactivated.",
    value: "device.autoopen.off",
  },
  {
    label: "Triggers when auto open is activated.",
    value: "device.autoopen.on",
  },
  {
    label: "Triggers when an auto open override is deactivated.",
    value: "device.autoopen.override.off",
  },
  {
    label: "Triggers when an auto open override is activated.",
    value: "device.autoopen.override.on",
  },
  {
    label: "Triggers when do not disturb (DND) is deactivated.",
    value: "device.forceclose.off",
  },
  {
    label: "Triggers when do not disturb (DND) is activated.",
    value: "device.forceclose.on",
  },
  {
    label: "Triggers when force unlock is deactivated.",
    value: "device.forceopen.off",
  },
  {
    label: "Triggers when force unlock is activated.",
    value: "device.forceopen.on",
  },
  {
    label: "Triggers when a door position sensor (DPS) changes to a closed state.",
    value: "device.input.dps.closed",
  },
  {
    label: "Triggers when a door position sensor (DPS) changes to an open state.",
    value: "device.input.dps.opened",
  },
  {
    label: "Triggers when a device is locked.",
    value: "device.input.relay.off",
  },
  {
    label: "Triggers when a device is unlocked.",
    value: "device.input.relay.on",
  },
  {
    label: "Triggers when the request to exit (REX) is deactivated.",
    value: "device.input.rex.off",
  },
  {
    label: "Triggers when the request to exit (REX) is activated.",
    value: "device.input.rex.on",
  },
  {
    label: "Triggers when a credential scan is emulated on a device (e.g. when opening a device using a software button).",
    value: "device.input.virtualread",
  },
  {
    label: "Triggers when a holder is recognized and granted access.",
    value: "device.request.allowed",
  },
  {
    label: "Triggers when a holder is recognized but denied access.",
    value: "device.request.denied",
  },
  {
    label: "Triggers when a holder enters a duress PIN.",
    value: "device.request.duress",
  },
  {
    label: "Triggers when access is granted using an emergency card. Since emergency cards can be used while a system is offline, these events may be delayed.",
    value: "device.request.ecard.allowed",
  },
  {
    label: "Triggers when access is denied using an emergency card. Since emergency cards can be used while a system is offline, these events may be delayed.",
    value: "device.request.ecard.denied",
  },
  {
    label: "Triggers when a holder is recognized.",
    value: "device.request.found",
  },
  {
    label: "Triggers when a credential is denied due to facility code filtering.",
    value: "device.request.filtered",
  },
  {
    label: "Triggers when a holder is granted access after multiple sequential scans. This behavior may be used to configure other actions, such as activating or deactivating an alarm system.",
    value: "device.request.multiallowed",
  },
  {
    label: "Triggers when a credential is presented but the holder is not recognized.",
    value: "device.request.unknown",
  },
];
