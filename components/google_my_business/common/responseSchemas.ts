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

export type Review = EntityWithCreateTime;
export type LocalPost = EntityWithCreateTime;
