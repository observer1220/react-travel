import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import rootStore from "./redux/store";

test("APP頁渲染", async () => {
  render(
    <Provider store={rootStore.store}>
      <App />
    </Provider>
  );
  // const titleEl = await screen.findAllByAltText(/React/i);
  // expect(titleEl).toBeInTheDocument();
});
