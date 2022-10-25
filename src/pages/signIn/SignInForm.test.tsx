import React from "react";
import { render, screen } from "@testing-library/react";
import { SignInForm } from "./SignInForm";
import { Provider } from "react-redux";
import rootStore from "../../redux/store";

test("測試登入功能", () => {
  render(
    <Provider store={rootStore.store}>
      <SignInForm />
    </Provider>
  );
  const name = screen.getByText("Username");
  expect(name).toBeInTheDocument();
  //   const password
  //   const linkElement = screen.getByText("登入");
  //   expect(linkElement).toBeInTheDocument();
});
