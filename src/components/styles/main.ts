import styled from "styled-components";

export const Container = styled.div`
    width: 1000px;
    max-width: 100%;
    margin 0 auto;
    padding: 5px 20px;
    background-color: ${({ theme }) => theme.colors.header};
    border-radius: 8px;
    color: white;
`;
