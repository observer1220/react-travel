import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import rootStore from "../../redux/store";
import "@testing-library/jest-dom/extend-expect";
import SearchPage from "./Searchpage";

describe("搜尋頁", () => {
  test("帳號測試", async () => {
    render(
      <Provider store={rootStore.store}>
        <SearchPage />
      </Provider>
    );
  });
});
