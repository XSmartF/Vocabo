import React from "react";

import { SectionCards } from "@/features/home/components/section-cards";
import { ChartAreaInteractive } from "@/features/home/components/chart-area-interactive";
import { DataTable } from "@/features/home/components/data-table";
import data from "@/features/home/mocks/data.json";
import Container from "@/shared/components/container";

const Home: React.FC = () => {
  return (
    <Container>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </Container>
  );
};

export default Home;
