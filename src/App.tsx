import { HistoryBlock } from "@components/history-block";
import { historyDates } from "@/mock/history-dates";

import "./styles/global.scss";

const App = () => {
  return (
    <>
      <HistoryBlock
        title="Исторические даты"
        data={historyDates}
      />
    </>
  );
};

export default App;
