import { useAppDispatch } from "../../redux/hooks";
import {
  Input,
  Button,
  Dialog,
  Bar,
  Title,
  Form,
  FormItem,
  TextArea,
  Select,
  Option,
  DatePicker,
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
  category: any;
  EstEndDate: any;
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
                  // console.log(formData);
                  if (option === "add") {
                    await dispatch(addTodolist(formData));
                    setFormData({
                      id: null,
                      todos: "",
                      remarks: "",
                      category: "",
                      EstEndDate: "",
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
        {fieldName.map((item, idx) => (
          <FormItem label={item.label} key={idx}>
            {item.type === "input" && (
              <Input
                value={formData[item.name]}
                onChange={(event) =>
                  setFormData({ ...formData, [item.name]: event.target.value })
                }
                placeholder={item.placeholder}
              />
            )}
            {item.type === "textarea" && (
              <TextArea
                value={formData[item.name]}
                onChange={(event) =>
                  setFormData({ ...formData, [item.name]: event.target.value })
                }
                placeholder={item.placeholder}
              />
            )}
            {item.type === "select" && (
              <Select
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [item.name]: event.detail.selectedOption.dataset.id,
                  });
                }}
              >
                <Option data-id=""></Option>
                <Option data-id="高">高</Option>
                <Option data-id="中">中</Option>
                <Option data-id="低">低</Option>
              </Select>
            )}
            {item.type === "datepicker" && (
              <DatePicker
                value={formData[item.name]}
                onChange={(event) => {
                  // console.log(event.detail.value);
                  setFormData({ ...formData, [item.name]: event.detail.value });
                }}
                placeholder={item.placeholder}
                primaryCalendarType="Gregorian"
              />
            )}
          </FormItem>
        ))}
      </Form>
    </Dialog>
  );
};
