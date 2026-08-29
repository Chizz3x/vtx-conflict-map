import React from "react";
import styled from "styled-components";
import { BandGapsTable } from "../components/BandGapsTable";
import { Legend } from "../components/Legend";

type Props = {
  hardMhz: number;
  mildMhz: number;
};

const BandsTab = ({ hardMhz, mildMhz }: Props) => {
  return (
    <BandsTabStyle>
      <p>
        Minimum frequency gap (MHz) between any two channels of each band pair. Same
        classification as the interactive table.
      </p>

      <BandGapsTable hardMhz={hardMhz} mildMhz={mildMhz} />

      <Legend hardMhz={hardMhz} mildMhz={mildMhz} />
    </BandsTabStyle>
  );
};

export { BandsTab };

const BandsTabStyle = styled.div`
  display: contents;
`;
