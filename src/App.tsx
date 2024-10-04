import { HistoryBlock } from "@components/history-block";
import { historyDates, historyDates2 } from "@/mock/history-dates";

import "./styles/global.scss";

const App = () => {
  return (
    <>
      <HistoryBlock
        title="Исторические даты"
        data={historyDates}
      />

      <HistoryBlock
        title="Исторические даты 2"
        data={historyDates2}
      />
    </>
  );
};

export default App;
