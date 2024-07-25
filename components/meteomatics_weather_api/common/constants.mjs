export default {
  PARAMETERS: [
    {
      label: "Instantaneous wind speed at 10m above ground",
      value: "wind_speed_10m:ms",
    },
    {
      label: "Instantaneous temperature at 2m above ground in degrees Celsius",
      value: "t_2m:C",
    },
    {
      label: "Precipitation accumulated over the past 24 hours in millimeter (equivalent to litres per square meter)",
      value: "precip_24h:mm",
    },
    {
      label: "UV index",
      value: "uv:idx",
    },
  ],
  FORMATS: [
    "csv",
    "xml",
    "json",
    "png",
  ],
};
