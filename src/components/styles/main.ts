import styled from "styled-components";

export const Container = styled.div(
  ({ theme }) => `
  width: 1000px;
  max-width: 100%;
  margin: 0 auto;
  padding: 5px 20px;
  border-radius: 8px;
`
);

//  background: ${theme.colors.header}
