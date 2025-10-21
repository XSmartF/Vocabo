import React from "react";

import { SectionCards } from "@/shared/components/section-cards";
import { ChartAreaInteractive } from "@/shared/components/chart-area-interactive";
import { DataTable } from "@/shared/components/data-table";
import data from "../mocks/data.json";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
};

export default Home;
