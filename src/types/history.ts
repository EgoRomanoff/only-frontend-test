export interface HistoryUnit {
  year: number,
  text: string,
}
export interface HistoryDate {
  title: string,
  startYear: number,
  endYear: number,
  events: HistoryUnit[],
}
