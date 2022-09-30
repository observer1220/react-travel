import React, { useEffect, useState } from "react";
import { MainLayout } from "../../layouts/mainLayout";
import { Input, Button, Table, Divider, Typography } from "antd";
import {
  Button as SAPButton,
  Input as SAPInput,
  Dialog,
  Bar,
  Title,
  Icon,
  Table as SAPTable,
  TableColumn,
  TableRow,
  TableCell,
  Label,
} from "@ui5/webcomponents-react";

import { useSelector, useAppDispatch } from "../../redux/hooks";
import {
  getTodolist,
  addTodolist,
  editTodolist,
  delTodolist,
} from "../../redux/todolist/slice";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";

// 繼承並新增username字段
interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

interface FormType {
  id: any;
  todos: any;
  remarks: any;
  username: string;
}

export const TodolistPage: React.FC = (props) => {
  // JWT解碼
  const jwt = useSelector((state) => state.user.token);
  // 表單的欄位
  const [formData, setFormData] = useState<FormType>({
    id: null,
    todos: "",
    remarks: "",
    username: "",
  });
  // 對話框欄位
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const data = useSelector((state) => state.todolist.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (jwt) {
      dispatch(getTodolist());
      // jwt解碼，並將解碼後的username顯示在header
      const token = jwt_decode<JwtPayload>(jwt);
      setFormData({
        id: null,
        todos: "",
        remarks: "",
        username: token.username,
      });
    }
  }, []);
  const columns = [
    {
      title: "NO",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "待辦事項",
      dataIndex: "todos",
      key: "todos",
    },
    {
      title: "備註",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "建立人員",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "功能",
      dataIndex: "",
      key: "x",
      render: (e) => (
        <div>
          {/* 編輯功能 */}
          <SAPButton
            design="Positive"
            icon="edit"
            style={{ marginRight: "5px" }}
            onClick={() => {
              setDialogIsOpen(true);
              // console.log(e);
              setFormData({
                id: e.id,
                todos: e.todos,
                remarks: e.remarks,
                username: e.username,
              });
            }}
          ></SAPButton>
          <Dialog
            open={dialogIsOpen}
            header={
              <Bar>
                <Title>編輯待辦事項</Title>
              </Bar>
            }
            footer={
              <Bar
                endContent={
                  <>
                    <SAPButton
                      onClick={() => {
                        // console.log("送出");
                        dispatch(editTodolist(formData));
                        setDialogIsOpen(false);
                        dispatch(getTodolist());
                      }}
                    >
                      確認
                    </SAPButton>
                    <SAPButton
                      onClick={() => {
                        setDialogIsOpen(false);
                      }}
                    >
                      取消
                    </SAPButton>
                  </>
                }
              />
            }
            // style={{ width: "50%" }}
          >
            <SAPInput
              style={{ display: "block" }}
              value={formData.todos}
              onChange={(e) =>
                setFormData({ ...formData, todos: e.target.value })
              }
              placeholder="請輸入待辦事項..."
            ></SAPInput>
            <SAPInput
              style={{ display: "block" }}
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="請輸入備註..."
            ></SAPInput>
          </Dialog>
          {/* 刪除功能 */}
          <SAPButton
            design="Negative"
            icon="delete"
            onClick={() => {
              // console.log(e.id);
              dispatch(delTodolist(e.id));
              dispatch(getTodolist());
            }}
          ></SAPButton>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <Divider orientation="left">
        <Typography.Title level={3}>本週待辦事項</Typography.Title>
      </Divider>
      <SAPInput
        style={{ width: "30%" }}
        value={formData.todos}
        onChange={(e) => setFormData({ ...formData, todos: e.target.value })}
        placeholder="請輸入待辦事項..."
      ></SAPInput>
      <SAPInput
        style={{ width: "30%" }}
        value={formData.remarks}
        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
        placeholder="請輸入備註..."
      ></SAPInput>
      <SAPButton
        onClick={() => {
          // console.log(formData);
          dispatch(addTodolist(formData));
          setFormData({
            id: null,
            todos: "",
            remarks: "",
            username: formData.username,
          });
        }}
      >
        送出
      </SAPButton>
      <br />
      <Table
        dataSource={data}
        columns={columns}
        rowKey={(r) => r.id}
        pagination={{ pageSize: 5 }}
      ></Table>
      {/* <SAPTable
        columns={
          <>
            <TableColumn style={{ width: "12rem" }}>
              <Label>ID</Label>
            </TableColumn>
            <TableColumn minWidth={800} popinText="Supplier">
              <Label>待辦事項</Label>
            </TableColumn>
            <TableColumn demandPopin minWidth={600} popinText="Weight">
              <Label>備註</Label>
            </TableColumn>
            <TableColumn>
              <Label>建立人員</Label>
            </TableColumn>
            <TableColumn>
              <Label>功能</Label>
            </TableColumn>
          </>
        }
      >
        <TableRow>
          <TableCell>
            <Label>{data}</Label>
          </TableCell>
          <TableCell>
            <Label>Very Best Screens</Label>
          </TableCell>
          <TableCell>
            <Label>30 x 18 x 3cm</Label>
          </TableCell>
          <TableCell>
            <Label>4.2KG</Label>
          </TableCell>
          <TableCell>
            <Label>956EUR</Label>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>Notebook Basic 17HT-1001</Label>
          </TableCell>
          <TableCell>
            <Label>Very Best Screens</Label>
          </TableCell>
          <TableCell>
            <Label>29 x 17 x 3.1cm</Label>
          </TableCell>
          <TableCell>
            <Label>4.5KG</Label>
          </TableCell>
          <TableCell>
            <Label>1249EUR</Label>
          </TableCell>
        </TableRow>
      </SAPTable> */}
    </MainLayout>
  );
};
