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

export interface BatchGetReviewsResponse {
  locationReviews: {
    review: Review
  }[];
}
