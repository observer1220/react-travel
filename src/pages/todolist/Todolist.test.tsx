import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import rootStore from "../../redux/store";
import "@testing-library/jest-dom/extend-expect";
import { TodolistPage } from "./TodolistPage";

describe("待辦事項", () => {
  test("頁面渲染", () => {
    render(
      <Provider store={rootStore.store}>
        <TodolistPage />
      </Provider>
    );
    const tableEl = screen.getByRole("grid");
    expect(tableEl).toBeInTheDocument();
  });
});
