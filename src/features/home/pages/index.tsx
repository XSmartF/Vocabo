import React from "react";

import { SectionCards } from "@/features/home/components/section-cards";
import { ChartAreaInteractive } from "@/features/home/components/chart-area-interactive";
import { DataTable } from "@/features/home/components/data-table";
import data from "@/features/home/mocks/data.json";

const Home: React.FC = () => {
  return (
    <div className="space-y-4">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={data} />
    </div>
  );
};

export default Home;
