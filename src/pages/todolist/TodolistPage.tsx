import React, { useEffect, useMemo, useState } from "react";
import { Divider } from "antd";
import {
  Button,
  AnalyticalTable,
  Title,
  FlexBox,
} from "@ui5/webcomponents-react";
import styles from "./TodolistPage.module.css";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { delTodolist, getTodolist } from "../../redux/todolist/slice";
import { Container } from "../../components/styles/main";
import { Pagination } from "../../components/Pagination";
import {
  DialogComponent,
  ExportButon,
  MessageBoxComponent,
} from "../../components";
import { AnalyticalTableHooks } from "@ui5/webcomponents-react";
import { IField } from "../../interface/interface";
import { ZodiacLayout } from "../../layouts/zodiacLayout";

export const TodolistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const jwt = useSelector((state) => state.user.token);
  const dataSource = useSelector((state) => state.todolist.data);
  const [title, setTitle] = useState("");
  const [option, setOption] = useState("");
  const [dialogStatus, setDialogStatus] = useState(false);
  const [messageStatus, setMessageStatus] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    todos: "",
    remarks: "",
    category: "",
    EstEndDate: "",
    trustee: [],
    phone: "",
    enabled: true,
    username: "",
  });
  const [PageSize, setPageSize] = useState(5);
  const [PatchDelete, setPatchDelete] = useState({
    patch: [],
    open: false,
  });

  // 對話框FORM表單內容: 資料驅動欄位生成，若填錯內容TypeScript會自動報錯
  const [fieldName] = useState<IField[]>([
    {
      label: "優先順序",
      placeholder: "請選擇優先順序...",
      name: "category",
      type: "select",
      options: [
        { label: "", value: "" },
        { label: "高", value: "高" },
        { label: "中", value: "中" },
        { label: "低", value: "低" },
      ],
      required: true,
    },
    {
      label: "預計完成日",
      placeholder: "請選擇預計完成日...",
      name: "EstEndDate",
      type: "datepicker",
      options: [],
      required: false,
    },
    {
      label: "待辦事項",
      placeholder: "請輸入待辦事項...",
      name: "todos",
      type: "input",
      options: [],
      required: false,
      minLength: 2,
      maxLength: 10,
    },
    {
      label: "備註",
      placeholder: "請輸入備註...",
      name: "remarks",
      type: "input",
      options: [],
      required: true,
      pattern: /^[A-Za-z]+$/i,
      patternMsg: "只能輸入英文",
    },
    {
      label: "受託人",
      placeholder: "",
      name: "trustee",
      type: "checkbox",
      options: [
        { label: "Jack", checked: false },
        { label: "Vincent", checked: false },
        { label: "Ruby", checked: false },
        { label: "Kent", checked: false },
        { label: "Susan", checked: false },
        { label: "Kimberly", checked: false },
      ],
      required: false,
    },
    {
      label: "電話號碼",
      name: "phone",
      placeholder: "請輸入電話號碼",
      type: "input",
      options: [],
      required: true,
      pattern: /^09\d{2}(\d{6}|-\d{3}-\d{3})+$/i,
      patternMsg: "請輸入正確格式",
    },
    {
      label: "啟動與否",
      name: "enabled",
      placeholder: "",
      type: "switch",
      options: [],
      required: false,
    },
  ]);

  // 設定分頁
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return dataSource.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, dataSource]);

  // 分頁元件: 只有dialogStatus變更才會重新渲染
  const DialogComponentMemo = useMemo(
    () => (
      <DialogComponent
        dialogTitle={title}
        option={option}
        isOpen={dialogStatus}
        onChangeStatus={setDialogStatus}
        formData={formData}
        fieldName={fieldName}
        pageName="TodoList"
      />
    ),
    [dialogStatus]
  );

  useEffect(() => {
    if (jwt) {
      dispatch(getTodolist());
    }
  }, []);

  const sourceLabel = [
    { id: "id", Header: "ID", accessor: "id", name: "id", width: 50 },
    {
      id: "category",
      Header: "優先順序",
      accessor: "category",
      name: "category",
      width: 100,
    },
    {
      id: "EstEndDate",
      Header: "預計完成日",
      accessor: "EstEndDate",
      name: "EstEndDate",
      width: 150,
    },
    {
      id: "todos",
      Header: "待辦事項",
      accessor: "todos",
      name: "todos",
      width: 200,
    },
    {
      id: "remarks",
      Header: "備註",
      accessor: "remarks",
      name: "remarks",
      width: 100,
    },
    {
      id: "username",
      Header: "建立人員",
      accessor: "username",
      name: "username",
      width: 150,
    },
    {
      id: "function",
      Header: "功能",
      accessor: ".",
      name: "function",
      width: 120,
      disableFilters: true,
      disableGroupBy: true,
      disableResizing: true,
      disableSortBy: true,
      Cell: (instance) => {
        const { row } = instance;
        return (
          <FlexBox>
            <Button
              design="Attention"
              icon="copy"
              style={{ marginRight: "5px" }}
              onClick={() => {
                setTitle("複製待辦事項");
                setDialogStatus(true);
                setOption("add");
                setFormData(row.original);
              }}
            ></Button>
            <Button
              design="Positive"
              icon="edit"
              style={{ marginRight: "5px" }}
              onClick={() => {
                setTitle("編輯待辦事項");
                setDialogStatus(true);
                setOption("edit");
                setFormData(row.original);
              }}
            />
            <Button
              design="Negative"
              icon="delete"
              onClick={async () => {
                setMessageStatus(true);
                setFormData(row.original);
              }}
            />
          </FlexBox>
        );
      },
    },
  ];

  return (
    <ZodiacLayout>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <Container>
          <Divider orientation="left">
            <Title level="H2" style={{ color: "white" }}>
              本週待辦事項
            </Title>
          </Divider>
          <Button
            design="Positive"
            icon="add"
            onClick={() => {
              setTitle("新增待辦事項");
              setDialogStatus(true);
              setOption("add");
              setFormData({
                id: null,
                todos: "",
                remarks: "",
                category: "",
                EstEndDate: "",
                trustee: [],
                phone: "",
                enabled: true,
                username: formData.username,
              });
            }}
          />
          {/* Export Component */}
          <ExportButon dataSource={dataSource} sourceLabel={sourceLabel} />
          {PatchDelete.patch.length > 1 ? (
            <Button
              design="Negative"
              onClick={async () => {
                // 這個寫法不好，一次呼叫三次API，如果一次勾100筆就會呼叫100次
                PatchDelete.patch.forEach((id) => {
                  dispatch(delTodolist(id));
                });
                // dispatch(getTodolist());
              }}
            >
              批次刪除
            </Button>
          ) : null}
          {/* 表格元件 */}
          <AnalyticalTable
            className="ui5-content-density-compact"
            columns={sourceLabel}
            data={currentTableData}
            filterable
            groupable
            rowHeight={40}
            // 無限滾輪
            // infiniteScroll={true}
            tableHooks={[AnalyticalTableHooks.useIndeterminateRowSelection()]}
            reactTableOptions={{ selectSubRows: true }}
            selectionMode="MultiSelect"
            onRowSelect={async (event) => {
              let PatchList: any = [];
              if (event!.detail.selectedFlatRows.length > 0) {
                event?.detail.selectedFlatRows.forEach((element) => {
                  PatchList.push(element.original.id);
                  setPatchDelete({
                    patch: PatchList,
                    open: true,
                  });
                });
              } else {
                setPatchDelete({
                  patch: [],
                  open: false,
                });
              }
            }}
          />
          {/* Dialog Component */}
          <>{DialogComponentMemo}</>
          {/* Pagination Component  */}
          <Pagination
            className={styles["pagination-bar"]}
            currentPage={currentPage}
            totalCount={dataSource.length}
            pageSize={PageSize}
            setPageSize={setPageSize}
            siblingCount={1}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
          {/* MessageBox Component */}
          <MessageBoxComponent
            isOpen={messageStatus}
            onChangeStatus={setMessageStatus}
            data={formData}
            pageName="TodoList"
          />
        </Container>
      </div>
    </ZodiacLayout>
  );
};
