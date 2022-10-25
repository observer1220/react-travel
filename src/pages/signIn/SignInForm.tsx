import styles from "./SignInForm.module.css";
import { Button, Checkbox, Form, Input } from "antd";
import { signIn } from "../../redux/user/slice";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export const SignInForm: React.FC = () => {
  const loading = useSelector((state) => state.user.loading);
  const jwt = useSelector((state) => state.user.token);
  const error = useSelector((state) => state.user.error);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    // 監控jwt，該值不為null及undefined時，自動跳轉至首頁
    if (jwt !== null && jwt !== undefined) {
      // navigate("/");
      window.location.href = "/";
    }
  }, [jwt]);

  const onFinish = async (values: any) => {
    dispatch(
      signIn({
        email: values.username,
        password: values.password,
      })
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className={styles["register-form"]}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
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
