export interface TaskData {
  job_id: number;
}

export interface CreateTaskResponse {
  message: string;
  status: number;
  data: TaskData;
}

