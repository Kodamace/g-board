import styled from "styled-components";

export const StyledHistogram = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledBarsOuter = styled.table`
  width: 800px;
`;
export const StyledBarWrapper = styled.div`
  display: flex;
  width: 80vw;
  padding: 8px;
  justify-content: center;
`;
export const StyledBarOuter = styled.td`
  height: 100px;
`;
export const StyledBar = styled.div`
  height: 100px;
  width: 80px;
`;

export const StyledBarContent = styled.tbody`
  vertical-align: bottom;
`;

export const StyledBarFill = styled.div<{ percentage: number; color: string }>`
  height: ${(props) => props.percentage}%;
  background-color: ${(props) => (props.color ? props.color : "white")};
`;
