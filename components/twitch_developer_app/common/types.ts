export interface Condition {
  broadcaster_user_id?: string;
}

export interface RawEvent {
  id: string;
  started_at: string;
  broadcaster_user_name: string;
}

export interface RaidEvent {
  id: string;
  created_at: string;
  from_broadcaster_user_login: string;
  from_broadcaster_user_name: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
}
