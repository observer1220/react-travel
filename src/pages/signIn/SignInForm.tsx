import styles from "./SignInForm.module.css";
import { Button, Checkbox, Form, Input } from "antd";
import { signIn } from "../../redux/user/slice";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";

export const SignInForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useSelector((state) => state.user.loading);
  const jwt = useSelector((state) => state.user.token);

  useEffect(() => {
    // 監控jwt，該值不為null及undefined時，自動跳轉至首頁
    if (jwt !== null && jwt !== undefined) {
      window.location.href = "/";
    }
  }, [jwt]);

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={(values) => {
        dispatch(
          signIn({
            email: values.username,
            password: values.password,
          })
        );
      }}
      onFinishFailed={(errorInfo) => {
        console.log("Failed:", errorInfo);
      }}
      autoComplete="off"
      className={styles["register-form"]}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="username" value="username" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="password" />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          登入
        </Button>
      </Form.Item>
    </Form>
  );
};
