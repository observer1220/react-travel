import { fireEvent, render, screen } from "@testing-library/react";
import { SignInForm } from "./SignInForm";
import { Provider } from "react-redux";
import rootStore from "../../redux/store";
import "@testing-library/jest-dom/extend-expect";
import fetchMock from "fetch-mock-jest";

function Condition(jwt: any) {
  if (jwt !== null && jwt !== undefined) {
    return (window.location.href = "/");
  }
}

describe("測試登入功能", () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  test("帳號測試", async () => {
    render(
      <Provider store={rootStore.store}>
        <SignInForm />
      </Provider>
    );
    const usernameInputEl: any = await screen.findByPlaceholderText("username");
    const usernameValue = "duck@gmail.com";
    fireEvent.change(usernameInputEl, { target: { value: usernameValue } });

    expect(usernameInputEl.value).toBe(usernameValue);
  });

  test("密碼測試", async () => {
    render(
      <Provider store={rootStore.store}>
        <SignInForm />
      </Provider>
    );
    const passwordInputEl: any = screen.getByPlaceholderText(/password/i);
    const passwordValue = "test1234";
    fireEvent.change(passwordInputEl, { target: { value: passwordValue } });

    expect(passwordInputEl.value).toBe(passwordValue);
  });

  test("按鈕是否出現?", async () => {
    render(
      <Provider store={rootStore.store}>
        <SignInForm />
      </Provider>
    );
    const buttonEl: any = screen.getByRole("button");

    expect(buttonEl).toBeInTheDocument();
  });

  test("測試IF、ELSE", async () => {
    render(
      <Provider store={rootStore.store}>
        <SignInForm />
      </Provider>
    );

    expect(Condition("test1234567890")).toBe("/");
  });

  test("測試API", () => {
    render(
      <Provider store={rootStore.store}>
        <SignInForm />
      </Provider>
    );
    fetchMock.getOnce("http://123.56.149.216:8089/auth/login/", {
      header: { "content-type": "application/json" },
      body: { email: "duck@gmail.com", password: "test1234" },
    });
  });

  afterAll(() => {
    console.error = originalError;
  });
});
