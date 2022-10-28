import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import rootStore from "../../redux/store";
import "@testing-library/jest-dom/extend-expect";
import { ChartsPage } from "./Charts";

describe("製程未結案查詢", () => {
  test("頁面渲染", () => {
    render(
      <Provider store={rootStore.store}>
        <ChartsPage />
      </Provider>
    );
  });
});
