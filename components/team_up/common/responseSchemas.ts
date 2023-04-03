export interface EventBody {
  subcalendar_ids: string;
  start_dt: string;
  end_dt: string;
  title?: string;
  location?: string;
}

export interface Event extends EventBody {
  id?: string;
}

export interface SubCalendar {
  id: string;
  name: string;
}
