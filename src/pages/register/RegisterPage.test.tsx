import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import rootStore from "../../redux/store";
import "@testing-library/jest-dom/extend-expect";
import { RegisterForm } from "./RegisterForm";

describe("註冊頁", () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  test("畫面渲染", async () => {
    render(
      <Provider store={rootStore.store}>
        <RegisterForm />
      </Provider>
    );
  });

  afterAll(() => {
    console.error = originalError;
  });
});
