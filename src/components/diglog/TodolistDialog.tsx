import { useAppDispatch, useSelector } from "../../redux/hooks";
import {
  Input,
  Button,
  Dialog,
  Bar,
  Title,
  Form,
  FormItem,
  TextArea,
  // Select,
  // Option,
  // DatePicker,
} from "@ui5/webcomponents-react";
import {
  addTodolist,
  editTodolist,
  getTodolist,
} from "../../redux/todolist/slice";
import { Controller, useForm } from "react-hook-form";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { useEffect } from "react";
// import { Select, DatePicker } from "antd";

interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

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
  formData: FormType;
  fieldName: any;
}

export const DialogComponent: React.FC<PropsType> = ({
  dialogTitle,
  option,
  isOpen,
  onChangeStatus,
  formData,
  fieldName,
}) => {
  const dispatch = useAppDispatch();
  const jwt = useSelector((state) => state.user.token);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  // console.log(formData);
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const onSubmit = handleSubmit(async (data: any) => {
    // 每一次新增資料時，註記建立人員是誰
    if (jwt) {
      const token = jwt_decode<JwtPayload>(jwt);
      data.username = token.username;
    }

    //　用option跑不同的方法
    if (option === "add") {
      await dispatch(addTodolist(data));
    }
    if (option === "edit") {
      await dispatch(editTodolist(data));
    }
    onChangeStatus(false);
    dispatch(getTodolist());
  });

  return (
    <Dialog
      style={{ width: "30%" }}
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
                  onSubmit();
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
      <Form
        columnsXL={3}
        columnsL={2}
        columnsM={2}
        columnsS={2}
        style={{ background: "#f8fcfc" }}
      >
        {fieldName.map((item, idx) => (
          <FormItem label={item.label} key={idx}>
            {item.type === "input" && (
              <Input
                {...register(item.name, {
                  required: item.required,
                  pattern: item.pattern,
                  minLength: item.minLength,
                  maxLength: item.maxLength,
                })}
                placeholder={item.placeholder}
              />
            )}
            {item.type === "textarea" && (
              <TextArea
                {...register(item.name, {
                  required: item.required,
                  pattern: item.pattern,
                })}
                placeholder={item.placeholder}
              />
            )}
            {item.type === "select" && (
              <Controller
                control={control}
                name={item.name}
                rules={{ required: item.required }}
                render={({ field }) => (
                  <select
                    style={{
                      width: "80px",
                      height: "34px",
                    }}
                    {...field}
                  >
                    <option value=""></option>
                    <option value="高">高</option>
                    <option value="中">中</option>
                    <option value="低">低</option>
                  </select>
                )}
              />
            )}
            {item.type === "datepicker" && (
              <Controller
                control={control}
                name={item.name}
                rules={{ required: item.required }}
                render={({ field }) => (
                  <input
                    type="date"
                    placeholder={item.placeholder}
                    {...field}
                  />
                )}
              />
            )}
            {/* 錯誤訊息 */}
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors[item.name]?.type === "required" && (
                <p>{item.label}不得為空</p>
              )}
              {errors[item.name]?.type === "pattern" && (
                <p>{item.patternMsg}</p>
              )}
              {errors[item.name]?.type === "minLength" && (
                <p>不得少於{item.minLength}位數</p>
              )}
              {errors[item.name]?.type === "maxLength" && (
                <p>不得多於{item.maxLength}位數</p>
              )}
              {errors[item.name]?.type === "min" && (
                <p>數字不得低於{item.min}</p>
              )}
            </div>
          </FormItem>
        ))}
      </Form>
    </Dialog>
  );
};
