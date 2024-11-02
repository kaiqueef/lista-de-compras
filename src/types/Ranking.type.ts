export interface Rankings {
  category: string;
  rankings: Ranking[];
}

export interface Ranking {
  name: string;
  stars: number;
}
