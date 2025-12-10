export const FIELDS_OPTIONS = [
  "date",
  "stock",
  "capacity",
  "closed_to_arrival",
  "closed_to_departure",
  "max_length_of_stay",
  "min_length_of_stay",
  "unavailable_cluster_objects",
  "out_of_order",
  "out_of_inventory",
];

export const LIMITERS_OPTIONS = [
  {
    label: "Return `limit` availabilities",
    value: "availabilities",
  },
  {
    label: "Limit to the `limit` best arrival dates",
    value: "start_dates",
  },
  {
    label: "Limit to the `limit` best Length of stay (LOS) values",
    value: "los",
  },
  {
    label: "Limit to the `limit` best rentable types",
    value: "rentable_types",
  },
  {
    label: "Limit to the `limit` best administrations",
    value: "administrations",
  },
];

export const SORTERS_OPTIONS = [
  {
    label: "Order by length of stay",
    value: "los",
  },
  {
    label: "Order by the distance of a particular length of stay",
    value: "los_distance",
  },
  {
    label: "Order by start dates",
    value: "start_date",
  },
  {
    label: "Order by the distance of a particular start date",
    value: "start_date_distance",
  },
  {
    label: "Order by the distance of a particular arrangement",
    value: "arrangement_distance",
  },
  {
    label: "Order by maximum guests of the type",
    value: "max_guests",
  },
  {
    label: "Order by availabilities that have a type that is highlighted",
    value: "highlighted",
  },
  {
    label: "Order by price",
    value: "all_in_amount",
  },
  {
    label: "Order by whether the amenities match",
    value: "amenity_ids_match_score",
  },
  {
    label: "Order by average score",
    value: "avg_score",
  },
];

export const WEEKDAY_OPTIONS = [
  {
    label: "Sunday",
    value: "0",
  },
  {
    label: "Monday",
    value: "1",
  },
  {
    label: "Tuesday",
    value: "2",
  },
  {
    label: "Wednesday",
    value: "3",
  },
  {
    label: "Thursday",
    value: "4",
  },
  {
    label: "Friday",
    value: "5",
  },
  {
    label: "Saturday",
    value: "6",
  },
];
