const TROUBLE_TICKET_PATH = "/api/sn_ind_tsm_sdwan/ticket/troubleTicket";

const DEFAULT_SEVERITY_OPTIONS = [
  {
    label: "Critical",
    value: "1",
  },
  {
    label: "High",
    value: "2",
  },
  {
    label: "Moderate",
    value: "3",
  },
  {
    label: "Low",
    value: "4",
  },
];

const INCIDENT_SEVERITY_OPTIONS = [
  ...DEFAULT_SEVERITY_OPTIONS,
  {
    label: "Planning",
    value: "5",
  },
];

export default {
  TROUBLE_TICKET_PATH,
  DEFAULT_SEVERITY_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
};
