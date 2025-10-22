import React from "react";

import { SectionCards } from "@/features/home/components/section-cards";
import { ChartAreaInteractive } from "@/features/home/components/chart-area-interactive";
import { DataTable } from "@/features/home/components/data-table";
import data from "@/features/home/mocks/data.json";

const Home: React.FC = () => {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-4">
      <SectionCards loading={loading} />
      <ChartAreaInteractive loading={loading} />
      <DataTable data={data} loading={loading} />
    </div>
  );
};

export default Home;
