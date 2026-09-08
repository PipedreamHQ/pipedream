export interface GoogleEntity {
  name: string;
}

export interface Location extends GoogleEntity {
  title: string;
}

export interface Account extends GoogleEntity {
  accountName: string;
  type: string;
}

export interface EntityWithCreateTime extends GoogleEntity {
  createTime: string;
}

export interface Review extends EntityWithCreateTime {
  comment: string;
  title: string;
}
export interface LocalPost extends EntityWithCreateTime {
  summary: string;
}

export interface ListReviewsResponse {
  reviews?: Review[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
}

export interface BatchGetReviewsResponse {
  locationReviews: {
    review: Review
  }[];
}

export interface DateParts {
  year?: number;
  month?: number;
  day?: number;
}

export interface DatedValue {
  date: DateParts;
  value?: string;
}

export interface TimeSeries {
  datedValues?: DatedValue[];
}

export interface GetDailyMetricsTimeSeriesResponse {
  timeSeries?: TimeSeries;
}

export interface DailyMetricTimeSeries {
  dailyMetric: string;
  dailySubEntityType?: object;
  timeSeries?: TimeSeries;
}

export interface MultiDailyMetricTimeSeries {
  dailyMetricTimeSeries?: DailyMetricTimeSeries[];
}

export interface FetchMultiDailyMetricsTimeSeriesResponse {
  multiDailyMetricTimeSeries?: MultiDailyMetricTimeSeries[];
}

export interface InsightsValue {
  value?: string;
  threshold?: string;
}

export interface SearchKeywordCount {
  searchKeyword: string;
  insightsValue?: InsightsValue;
}
