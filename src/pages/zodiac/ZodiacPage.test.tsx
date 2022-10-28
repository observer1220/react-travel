import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import rootStore from "../../redux/store";
import "@testing-library/jest-dom/extend-expect";
import { ZodiacPage } from "./ZodiacPage";

describe("購物車", () => {
  test("頁面渲染", () => {
    render(
      <Provider store={rootStore.store}>
        <ZodiacPage />
      </Provider>
    );
  });
});
