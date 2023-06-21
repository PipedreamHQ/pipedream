export interface ConcordEntity {
  id: number;
  name: string;
}

export type Folder = ConcordEntity & {
  children: Folder[];
};
export interface FolderOption {
  label: string;
  value: Folder["id"];
}

export type Organization = ConcordEntity;

export interface Agreement {
  uuid: string;
  title: string;
  status: string;
}
