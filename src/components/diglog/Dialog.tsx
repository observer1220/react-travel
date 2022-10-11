import { useEffect, useState } from "react";
import { useAppDispatch, useSelector } from "../../redux/hooks";
import {
  Input,
  Button as SAPButton,
  Dialog,
  Bar,
  Title,
  Button,
} from "@ui5/webcomponents-react";
import {
  editProcessPendingList,
  getProcessPendingList,
} from "../../redux/processPending/slice";

interface FormType {
  id: any;
  todos: any;
  remarks: any;
  username: string;
}

interface PropsType {
  dialogIsOpen: boolean;
  setDialogIsOpen: any;
}

export const ProcessPendingDialog: React.FC<PropsType> = ({
  dialogIsOpen,
  setDialogIsOpen,
}) => {
  const dispatch = useAppDispatch();
  // console.log(dialogIsOpen, setDialogIsOpen);

  const [formData, setFormData] = useState<FormType>({
    id: null,
    todos: "",
    remarks: "",
    username: "",
  });

  return (
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
                onClick={async () => {
                  await dispatch(editProcessPendingList(formData));
                  dispatch(getProcessPendingList());
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
    >
      <Input
        style={{ display: "block" }}
        value={formData.todos}
        onChange={(e) => setFormData({ ...formData, todos: e.target.value })}
        placeholder="請輸入待辦事項..."
      ></Input>
      <Input
        style={{ display: "block" }}
        value={formData.remarks}
        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
        placeholder="請輸入備註..."
      ></Input>
    </Dialog>
  );
};
