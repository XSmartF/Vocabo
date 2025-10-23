import React from "react";

import { SectionCards } from "@/features/home/components/section-cards";
import { ChartAreaInteractive } from "@/features/home/components/chart-area-interactive";
import DataTable from "../components/data-table";
import ServerDataTable from "../components/ServerDataTable";

const Home: React.FC = () => {
  return (
    <div className="space-y-4">
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable />
      <div className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Server-backed table (json-server)</h3>
        <ServerDataTable />
      </div>
    </div>
  );
};

export default Home;
