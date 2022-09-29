import React, { useEffect, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Input, Button, Table, Divider, Typography } from "antd";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import {
  getTodolist,
  addTodolist,
  delTodolist,
} from "../../redux/todolist/slice";
import { DeleteOutlined } from "@ant-design/icons";

export const TodolistPage: React.FC = (props) => {
  const [todos, setTodos] = useState("");
  const data = useSelector((state) => state.todolist.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTodolist());
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "待辦事項",
      dataIndex: "todos",
      key: "todos",
    },
    {
      title: "功能",
      dataIndex: "",
      key: "x",
      render: (e) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            // console.log(e.id);
            dispatch(delTodolist(e.id));
            dispatch(getTodolist());
          }}
        >
          刪除
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <Divider orientation="left">
        <Typography.Title level={3}>本週待辦事項</Typography.Title>
      </Divider>
      <Input.Group compact>
        <Input
          style={{ width: "70%" }}
          value={todos}
          onChange={(e) => setTodos(e.target.value)}
          placeholder="請輸入待辦事項..."
        ></Input>
        <Button
          type="primary"
          placeholder="請輸入待辦事項"
          onClick={() => {
            // console.log(todos);
            dispatch(addTodolist(todos));
            setTodos("");
            dispatch(getTodolist());
          }}
        >
          送出
        </Button>
      </Input.Group>
      <br />
      <Table
        dataSource={data}
        columns={columns}
        rowKey={(r) => r.id}
        pagination={{ pageSize: 5 }}
      ></Table>
    </MainLayout>
  );
};
