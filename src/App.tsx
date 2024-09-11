/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import DigitalClock from "./components/DigitalClock";
import TimeZoneSelector from "./components/TimeZoneSelector";
/**
 * Renders a digital clock component that displays the current time in the selected time zone.
 *
 * @return {JSX.Element} The digital clock component.
 */
function App() {
  const [zone, setZone] = useState("Asia/Jakarta");
  const [jam, setJam] = useState(DateTime.now().setZone("Asia/Jakarta"));
  const [loading, setLoading] = useState(false);
  const [loadingLibur, setLoadingLibur] = useState(false);
  const [holidays, setHolidays] = useState<any[]>([]);
  const currentMonth: number = jam.month;
  const currentYear: number = jam.year;
  useEffect(() => {
    setLoading(true);
    setLoadingLibur(true);

    async function fetchHolidays() {
      try {
        const apiUrl: string = `https://api-harilibur.vercel.app/api?month=${currentMonth}&year=${currentYear}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setHolidays(data);
        setLoadingLibur(false);
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil hari libur:", error);
        setLoadingLibur(false);
      }
    }

    fetchHolidays();

    const intervalId = setInterval(() => {
      setJam(DateTime.now().setZone(zone));
      setLoading(false);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [zone, currentMonth, currentYear]);

  return (
    <main className="bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 background-animate flex items-center justify-center h-screen w-screen px-2 py-24 md:px-8">
      <div className="w-full md:w-96 bg-white bg-opacity-40 backdrop-blur-lg rounded-xl drop-shadow-lg text-center">
        <div className="p-5 overflow-hidden">
          <DigitalClock loading={loading} jam={jam} />

          <TimeZoneSelector
            zone={zone}
            setZone={setZone}
            setLoading={setLoading}
            loadingLibur={loadingLibur}
            holidays={holidays}
          />

          <a
            className="text-center mt-5 font-semibold p-3 bg-white bg-opacity-30 rounded-full text-white flex gap-x-1 items-center justify-center"
            target="_new"
            href="https://biolink.eu.org/fuds"
          >
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6v12m8-12v12l-8-6 8-6Z"/>
</svg>

            Airdrop Hunter
          </a>
        </div>
      </div>
    </main>
  );
}

export default App;
