interface CustomerData {
  email: string;
}

export interface Customer extends CustomerData {
  first_name: string;
  last_name: string;
  customer_id: string;
}

export interface Subscription extends CustomerData {
  subscription_id: string;
  subscription_alias?: string;
  user_alias?: string;
}
