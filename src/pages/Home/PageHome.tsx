import React from "react";
import styled from "styled-components";
import { useAppTheme } from "@theme/index";
import { useVtxPlanner } from "./useVtxPlanner";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { Footer } from "./components/Footer";
import { MatrixTab } from "./tabs/MatrixTab";
import { BandsTab } from "./tabs/BandsTab";

const PageHome = () => {
  const { mode, toggleTheme } = useAppTheme();
  const planner = useVtxPlanner();

  return (
    <PageHomeStyle id="Home">
      <Header mode={mode} onToggleTheme={toggleTheme} />
      <Tabs tab={planner.tab} onTabChange={planner.setTab} />
      <main className="main">
        {planner.tab === "matrix" ? (
          <MatrixTab planner={planner} />
        ) : (
          <BandsTab hardMhz={planner.hardMhz} mildMhz={planner.mildMhz} />
        )}
      </main>
      <Footer />
    </PageHomeStyle>
  );
};

export { PageHome };

const PageHomeStyle = styled.div`
  flex-shrink: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: system-ui, sans-serif;
  color: ${({ theme }) => theme.palette.text.primary};

  .main {
    flex-shrink: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    overflow-y: auto;
  }
`;
