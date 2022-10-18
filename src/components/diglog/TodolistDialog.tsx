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
  Switch,
  DatePicker,
  CheckBox,
  Select,
  Option,
} from "@ui5/webcomponents-react";
import {
  addTodolist,
  editTodolist,
  getTodolist,
} from "../../redux/todolist/slice";
import { Controller, useForm } from "react-hook-form";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
// import { Switch } from "antd";

interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

interface FormType {
  id: any;
  todos: any;
  remarks: any;
  category: any;
  EstEndDate: any;
  trustee: any;
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

  useEffect(() => {
    console.log(formData);
    reset(formData);
  }, [formData, reset]);

  const onSubmit = handleSubmit(async (data: any) => {
    console.log(data);

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
        columnsL={1}
        columnsM={1}
        columnsS={1}
        style={{ background: "#f8fcfc" }}
      >
        {fieldName.map((item, idx) => (
          <FormItem label={item.label} key={idx}>
            {/* 一般輸入框 */}
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
            {/* 多行輸入框 */}
            {item.type === "textarea" && (
              <TextArea
                {...register(item.name, {
                  required: item.required,
                  pattern: item.pattern,
                })}
                placeholder={item.placeholder}
              />
            )}
            {/* 下拉選單 */}
            {item.type === "select" && (
              <select
                {...register(item.name, {
                  required: item.required,
                })}
                placeholder={item.placeholder}
                style={{ height: "34px", minWidth: "60px" }}
              >
                {item.options.map((element, idx) => (
                  <option key={idx} value={element.value}>
                    {element.label}
                  </option>
                ))}
              </select>
              // 編輯時資料無法回填...
              // <Controller
              //   control={control}
              //   name={item.name}
              //   rules={{ required: item.required }}
              //   render={({ field: { onChange, name } }) => {
              //     return (
              //       <Select
              //         {...register(name)}
              //         placeholder={item.placeholder}
              //         onChange={(event) => {
              //           onChange(event.detail.selectedOption.dataset.id);
              //         }}
              //       >
              //         {item.options.map((element, idx) => (
              //           <Option key={idx} data-id={element.value}>
              //             {element.label}
              //           </Option>
              //         ))}
              //       </Select>
              //     );
              //   }}
              // />
            )}
            {/* 日期選單 */}
            {item.type === "datepicker" && (
              <Controller
                control={control}
                name={item.name}
                rules={{ required: item.required }}
                render={({ field }) => (
                  <DatePicker
                    placeholder={item.placeholder}
                    {...field}
                    onChange={(event) => {
                      field.onChange(event.detail.value);
                    }}
                  />
                )}
              />
            )}
            {/* 複選框 */}
            {item.type === "checkbox" && (
              <div style={{ display: "flex" }}>
                {item.options.map((element, idx) => {
                  const fieldName: any = `trustee[${idx}]`;
                  return (
                    <Controller
                      key={idx}
                      control={control}
                      name={fieldName}
                      render={({ field: { onChange, value } }) => (
                        <CheckBox
                          text={element.label}
                          onChange={(event: any) => {
                            onChange(event.target.checked);
                          }}
                          checked={value}
                        />
                      )}
                    />
                  );
                })}
              </div>
            )}
            {/* 純數字 */}
            {item.type === "number" && (
              <Input
                type="Number"
                {...register(item.name, {
                  required: item.required,
                  min: item.min,
                  max: item.max,
                })}
                placeholder={item.placeholder}
              />
            )}
            {/* 切換開關 */}
            {item.type === "switch" && (
              <Controller
                key={idx}
                control={control}
                name={item.name}
                render={({ field }) => (
                  <Switch
                    {...register(item.name)}
                    {...field}
                    onChange={(event) => {
                      field.onChange(event.target.checked);
                    }}
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
              {errors[item.name]?.type === "min" && <p>不得低於{item.min}</p>}
              {errors[item.name]?.type === "max" && <p>不得大於{item.max}</p>}
            </div>
          </FormItem>
        ))}
      </Form>
    </Dialog>
  );
};
