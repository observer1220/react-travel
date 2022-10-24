import "./ProcessPending.module.css";
import {
  Button,
  Bar,
  Title,
  AnalyticalTable,
  AnalyticalTableHooks,
  FlexBox,
} from "@ui5/webcomponents-react";
import { useAppDispatch, useSelector } from "../../redux/hooks";
import { useEffect, useMemo, useState } from "react";
import { getProcessPendingList } from "../../redux/processPending/slice";
import {
  DialogComponent,
  MessageBoxComponent,
  MultiSearchComponent,
} from "../../components";
import { IField } from "../../interface/interface";

interface IFormInput {
  purchaseOrderNo: any;
  purchaseOrderLine: any;
  orderType: any;
  orderNo: any;
  StandardTextCode: any;
  ProcessCode: any;
  ManufacturerCode: any;
  ProductName: any;
  ESTEndDate: any;
  ESTStartDate: any;
  ESTDeliveryDate: any;
  pickingStatus: any;
  inputQTY: any;
  completedQTY: any;
}

export const ProcessPendingPage: React.FC = () => {
  const jwt = useSelector((state) => state.user.token);
  const dataSource = useSelector((state) => state.processPendingList.data);
  const [title, setTitle] = useState("");
  const [option, setOption] = useState("");
  const [dialogStatus, setDialogStatus] = useState(false);
  const [messageStatus, setMessageStatus] = useState(false);
  const [PageSize, setPageSize] = useState(5);
  const [PatchDelete, setPatchDelete] = useState({
    patch: [],
    open: false,
  });

  const [formData, setFormData] = useState<IFormInput>({
    purchaseOrderNo: "",
    purchaseOrderLine: "",
    orderType: "",
    orderNo: "",
    StandardTextCode: "",
    ProcessCode: "",
    ManufacturerCode: "",
    ProductName: "",
    ESTEndDate: "",
    ESTStartDate: "",
    ESTDeliveryDate: "",
    pickingStatus: "",
    inputQTY: "",
    completedQTY: "",
  });

  // 設定分頁
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return dataSource.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, dataSource]);

  // 對話框欄位設定
  const [fieldName] = useState<IField[]>([
    {
      label: "採購單號",
      placeholder: "請輸入採購單號...",
      name: "purchaseOrderNo",
      type: "input",
      required: true,
    },
    {
      label: "採購單項次",
      placeholder: "請輸入採購單項次...",
      name: "purchaseOrderLine",
      type: "input",
      required: true,
    },
    {
      label: "廠商代號",
      placeholder: "請輸入廠商代號...",
      name: "ManufacturerCode",
      type: "input",
      required: true,
    },
    {
      label: "工單單別",
      placeholder: "請輸入工單單別...",
      name: "orderType",
      type: "input",
      required: true,
    },
    {
      label: "工單單號內外徑",
      placeholder: "請輸入工單單號內外徑...",
      name: "orderNo",
      type: "input",
      required: false,
    },
    {
      label: "品名",
      placeholder: "請輸入品名...",
      name: "ProductName",
      type: "input",
      required: false,
    },
    {
      label: "標準內文碼",
      placeholder: "請輸入標準內文碼...",
      name: "StandardTextCode",
      type: "input",
      required: false,
    },
    {
      label: "製程代號",
      placeholder: "請輸入製程代號...",
      name: "ProcessCode",
      type: "input",
      required: false,
    },
    {
      label: "預計開工日",
      placeholder: "請選擇預計開工日...",
      name: "ESTStartDate",
      type: "datepicker",
      required: false,
    },
    {
      label: "預計完成日",
      placeholder: "請選擇預計完成日...",
      name: "ESTEndDate",
      type: "datepicker",
      required: false,
    },
    {
      label: "投入數量",
      placeholder: "請輸入投入數量...",
      name: "inputQTY",
      type: "input",
      required: false,
    },
    {
      label: "完成數量",
      placeholder: "請輸入完成數量...",
      name: "completedQTY",
      type: "input",
      required: false,
    },
    {
      label: "預交日期",
      placeholder: "請選擇預交日期...",
      name: "ESTDeliveryDate",
      type: "datepicker",
      required: false,
    },
    {
      label: "領料狀態",
      placeholder: "",
      name: "pickingStatus",
      type: "switch",
      required: false,
    },
  ]);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<IFormInput>();

  const sourceLabel = [
    { id: "id", Header: "NO", accessor: "id", name: "id", width: 50 },
    {
      id: "purchaseOrderNo",
      Header: "採購單號",
      accessor: "purchaseOrderNo",
      name: "purchaseOrderNo",
      width: 100,
    },
    {
      id: "purchaseOrderLine",
      Header: "採購單項次",
      accessor: "purchaseOrderLine",
      name: "purchaseOrderLine",
      width: 100,
    },
    {
      id: "ManufacturerCode",
      Header: "廠商代號",
      accessor: "ManufacturerCode",
      name: "ManufacturerCode",
      width: 100,
    },
    {
      id: "orderType",
      Header: "工單單別",
      accessor: "orderType",
      name: "orderType",
      width: 100,
    },
    {
      id: "orderNo",
      Header: "工單單號內外徑",
      accessor: "orderNo",
      name: "orderNo",
      width: 150,
    },
    {
      id: "ProductName",
      Header: "品名",
      accessor: "ProductName",
      name: "ProductName",
      width: 150,
    },
    {
      id: "StandardTextCode",
      Header: "標準內文碼",
      accessor: "StandardTextCode",
      name: "StandardTextCode",
      width: 150,
    },
    {
      id: "ESTStartDate",
      Header: "製程代號",
      accessor: "ESTStartDate",
      name: "ESTStartDate",
      width: 150,
    },
    {
      id: "ESTEndDate",
      Header: "預計開工日",
      accessor: "ESTEndDate",
      name: "ESTEndDate",
      width: 150,
    },
    {
      id: "inputQTY",
      Header: "投入數量",
      accessor: "inputQTY",
      name: "inputQTY",
      width: 100,
    },
    {
      id: "completedQTY",
      Header: "完成數量",
      accessor: "completedQTY",
      name: "completedQTY",
      width: 100,
    },
    {
      id: "ESTDeliveryDate",
      Header: "預交日期",
      accessor: "ESTDeliveryDate",
      name: "ESTDeliveryDate",
      width: 150,
    },
    {
      id: "pickingStatus",
      Header: "領料狀態",
      accessor: "pickingStatus",
      name: "pickingStatus",
      // width: 100,
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
            <div>
              {/* 複製功能 */}
              <Button
                design="Attention"
                icon="copy"
                style={{ marginRight: "5px" }}
                onClick={() => {
                  setTitle("複製項目");
                  setDialogStatus(true);
                  setOption("copy");
                  setFormData(row.original);
                }}
              ></Button>
              {/* 編輯功能 */}
              <Button
                design="Positive"
                icon="edit"
                style={{ marginRight: "5px" }}
                onClick={() => {
                  setTitle("編輯項目");
                  setDialogStatus(true);
                  setOption("edit");
                  setFormData(row.original);
                }}
              ></Button>
              {/* 刪除功能 */}
              <Button
                design="Negative"
                icon="delete"
                onClick={() => {
                  setMessageStatus(true);
                  setFormData(row.original);
                }}
              ></Button>
            </div>
          </FlexBox>
        );
      },
    },
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (jwt) {
      dispatch(getProcessPendingList());
      // const token = jwt_decode<JwtPayload>(jwt);
    }
  }, []);

  // 分頁元件: 只有dialogStatus及formData變更才會重新渲染
  const DialogComponentMemo = useMemo(
    () => (
      <DialogComponent
        dialogTitle={title}
        option={option}
        isOpen={dialogStatus}
        onChangeStatus={setDialogStatus}
        formData={formData}
        fieldName={fieldName}
        pageName="ProcessPending"
      />
    ),
    [dialogStatus, formData]
  );

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {/* 頂部欄位 */}
      <Bar
        endContent={
          <Button
            icon="refresh"
            onClick={() => window.location.reload()}
          ></Button>
        }
      >
        <Title>
          <strong>製程未結案查詢</strong>
        </Title>
      </Bar>
      {/* 搜尋表單 */}
      <MultiSearchComponent data={fieldName} />
      <Bar
        endContent={
          <>
            <Button style={{ margin: "0 5px" }} onClick={() => {}}>
              匯出至Excel
            </Button>
            <Button
              icon="add"
              style={{ margin: "0 5px" }}
              onClick={() => {
                setTitle("新增項目");
                setDialogStatus(true);
                setOption("add");
                setFormData({
                  purchaseOrderNo: "",
                  purchaseOrderLine: "",
                  ManufacturerCode: "",
                  orderType: "",
                  orderNo: "",
                  ProductName: "",
                  StandardTextCode: "",
                  ProcessCode: "",
                  ESTStartDate: "",
                  ESTEndDate: "",
                  inputQTY: "",
                  completedQTY: "",
                  ESTDeliveryDate: "",
                  pickingStatus: "",
                });
              }}
            />
          </>
        }
      ></Bar>
      {/* 表格區域 */}
      <div style={{ background: "#deeff2", padding: "30px 0" }}>
        {/* 表格元件 */}
        <AnalyticalTable
          scaleWidthMode="Grow"
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
        {/* MessageBox Component */}
        <MessageBoxComponent
          isOpen={messageStatus}
          onChangeStatus={setMessageStatus}
          data={formData}
          pageName="ProcessPending"
        />
      </div>
    </div>
  );
};
