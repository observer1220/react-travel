import { useAppDispatch } from "../../redux/hooks";
import { Button, MessageBox } from "@ui5/webcomponents-react";
import { delTodolist, getTodolist } from "../../redux/todolist/slice";

interface PropsType {
  isOpen: boolean;
  onChangeStatus: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}

export const DeleteMessageBox: React.FC<PropsType> = ({
  isOpen,
  onChangeStatus,
  data,
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
          onClick={() => {
            dispatch(delTodolist(data.id));
            dispatch(getTodolist());
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
