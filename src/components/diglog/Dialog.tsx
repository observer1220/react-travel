import { useAppDispatch } from "../../redux/hooks";
import {
  Input,
  Button,
  Dialog,
  Bar,
  Title,
  Form,
  FormItem,
} from "@ui5/webcomponents-react";
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
  dialogTitle: string;
  option: string;
  isOpen: boolean;
  onChangeStatus: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<FormType>>;
  fieldName: any;
}

export const DialogComponent: React.FC<PropsType> = ({
  dialogTitle,
  option,
  isOpen,
  onChangeStatus,
  formData,
  setFormData,
  fieldName,
}) => {
  const dispatch = useAppDispatch();
  console.log(fieldName);

  return (
    <Dialog
      open={isOpen}
      header={
        <Bar>
          <Title level="H3">
            <strong>{dialogTitle}</strong>
          </Title>
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
      <Form>
        {fieldName.map((e, idx) => (
          <FormItem label={e.label} key={idx}>
            <Input
              value={formData[e.name]}
              onChange={(event) =>
                setFormData({ ...formData, [e.name]: event.target.value })
              }
              placeholder={e.placeholder}
            ></Input>
          </FormItem>
        ))}
      </Form>
    </Dialog>
  );
};
