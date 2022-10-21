import { useAppDispatch } from "../../redux/hooks";
import { Button, MessageBox } from "@ui5/webcomponents-react";
import { delTodolist, getTodolist } from "../../redux/todolist/slice";
import {
  delProcessPendingList,
  getProcessPendingList,
} from "../../redux/processPending/slice";

interface PropsType {
  isOpen: boolean;
  onChangeStatus: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  pageName: string;
}

export const MessageBoxComponent: React.FC<PropsType> = ({
  isOpen,
  onChangeStatus,
  data,
  pageName,
}) => {
  const dispatch = useAppDispatch();

  return (
    <MessageBox
      open={isOpen}
      titleText="確認刪除?"
      type="Confirm"
      onClose={() => {
        onChangeStatus(false);
      }}
      actions={[
        <Button
          key={1}
          onClick={async () => {
            switch (pageName) {
              case "TodoList":
                await dispatch(delTodolist(data.id));
                await dispatch(getTodolist());
                break;
              case "ProcessPending":
                await dispatch(delProcessPendingList(data.id));
                await dispatch(getProcessPendingList());
                break;
            }
          }}
        >
          確認
        </Button>,
        <Button key={2}>取消</Button>,
      ]}
    >
      確認刪除本筆資料?
    </MessageBox>
  );
};
