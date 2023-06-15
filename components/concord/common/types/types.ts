export interface ConcordEntity {
  id: number;
  name: string;
}

export interface Folder extends ConcordEntity {}
export interface Organization extends ConcordEntity {}
