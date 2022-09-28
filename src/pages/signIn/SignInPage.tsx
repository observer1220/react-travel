import React from "react";
import { UserLayout } from "../../layouts/userLayout";
import { SignInForm } from "./SignInForm";
export const SignInPage: React.FC = () => {
  return (
    <UserLayout>
      <h1>登入頁面</h1>
      <SignInForm />
    </UserLayout>
  );
};
