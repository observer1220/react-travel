import { useAppDispatch } from "../../redux/hooks";
import { Input, Button, Dialog, Bar, Title } from "@ui5/webcomponents-react";
import {
  addTodolist,
  editTodolist,
  getTodolist,
} from "../../redux/todolist/slice";

interface FormType {
  id: any;
  todos: any;
  remarks: any;
  username: string;
}

interface PropsType {
  title: string;
  option: string;
  isOpen: boolean;
  onChangeStatus: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<FormType>>;
}

export const ProcessPendingDialog: React.FC<PropsType> = ({
  title,
  option,
  isOpen,
  onChangeStatus,
  formData,
  setFormData,
}) => {
  const dispatch = useAppDispatch();
  return (
    <Dialog
      open={isOpen}
      header={
        <Bar>
          <Title>{title}</Title>
        </Bar>
      }
      footer={
        <Bar
          endContent={
            <>
              <Button
                onClick={async () => {
                  if (option === "add") {
                    await dispatch(addTodolist(formData));
                    setFormData({
                      id: null,
                      todos: "",
                      remarks: "",
                      username: formData.username,
                    });
                  } else if (option === "edit") {
                    await dispatch(editTodolist(formData));
                  }
                  onChangeStatus(false);
                  dispatch(getTodolist());
                }}
              >
                確認
              </Button>
              <Button
                onClick={() => {
                  onChangeStatus(false);
                }}
              >
                取消
              </Button>
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
