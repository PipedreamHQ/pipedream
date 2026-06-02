import { getOption } from "../utils.mjs";

const fields = [
  "campaign",
  "resource_name",
  "search_term",
].map((f) => getOption(f, "campaign_search_term_view"));

const segments = [
  "ad_network_type",
  "conversion_action",
  "conversion_action_category",
  "conversion_action_name",
  "date",
  "day_of_week",
  "device",
  "external_conversion_source",
  "keyword.ad_group_criterion",
  "keyword.info.match_type",
  "keyword.info.text",
  "month",
  "month_of_year",
  "quarter",
  "search_term_match_source",
  "search_term_match_type",
  "search_term_targeting_status",
  "week",
  "year",
].map((f) => getOption(f, "segments"));

const metrics = [
  "absolute_top_impression_percentage",
  "all_conversions",
  "all_conversions_from_interactions_rate",
  "all_conversions_from_interactions_value_per_interaction",
  "all_conversions_value",
  "all_conversions_value_per_cost",
  "average_cost",
  "average_cpc",
  "average_cpe",
  "average_cpm",
  "average_cpv",
  "clicks",
  "conversions",
  "conversions_from_interactions_rate",
  "conversions_from_interactions_value_per_interaction",
  "conversions_value",
  "conversions_value_per_cost",
  "cost_micros",
  "cost_per_all_conversions",
  "cost_per_conversion",
  "cross_device_conversions",
  "ctr",
  "engagement_rate",
  "engagements",
  "impressions",
  "interaction_event_types",
  "interaction_rate",
  "interactions",
  "top_impression_percentage",
  "value_per_all_conversions",
  "value_per_conversion",
  "video_quartile_p100_rate",
  "video_quartile_p25_rate",
  "video_quartile_p50_rate",
  "video_quartile_p75_rate",
  "video_view_rate",
  "video_views",
  "view_through_conversions",
].map((f) => getOption(f, "metrics"));

const resourceOption = {
  label: "Search Term",
  value: "campaign_search_term_view",
};

export const campaignSearchTermView = {
  fields,
  segments,
  metrics,
  resourceOption,
  // This is a read-only view with no `<resource>.id`; filter by campaign instead.
  filterResource: "campaign",
  filterLabel: "Campaign",
  filterField: "campaign.id",
};
