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
  ObjectStatus,
  Label,
} from "@ui5/webcomponents-react";
import {
  addTodolist,
  editTodolist,
  getTodolist,
} from "../../redux/todolist/slice";
import { Controller, useForm } from "react-hook-form";
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
import { useEffect } from "react";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import {
  addProcessPendingList,
  editProcessPendingList,
  getProcessPendingList,
} from "../../redux/processPending/slice";
import styles from "./Dialog.module.css";

interface JwtPayload extends DefaultJwtPayload {
  username: string;
}

interface PropsType {
  dialogTitle: string;
  option: string;
  isOpen: boolean;
  onChangeStatus: React.Dispatch<React.SetStateAction<boolean>>;
  formData: any;
  fieldName: any;
  pageName: string;
}

export const DialogComponent: React.FC<PropsType> = ({
  dialogTitle,
  option,
  isOpen,
  onChangeStatus,
  formData,
  fieldName,
  pageName,
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
    reset(formData);
  }, [formData, reset]);

  const onSubmit = handleSubmit(async (data: any) => {
    // console.log(data);

    if (jwt) {
      const token = jwt_decode<JwtPayload>(jwt);
      data.username = token.username;
    }

    if (option === "add") {
      switch (pageName) {
        case "TodoList":
          dispatch(addTodolist(data));
          break;
        case "ProcessPending":
          dispatch(addProcessPendingList(data));
          break;
      }
    }

    if (option === "edit") {
      switch (pageName) {
        case "TodoList":
          dispatch(editTodolist(data));
          break;
        case "ProcessPending":
          dispatch(editProcessPendingList(data));
          break;
      }
    }

    onChangeStatus(false);

    switch (pageName) {
      case "TodoList":
        dispatch(getTodolist());
        break;
      case "ProcessPending":
        dispatch(getProcessPendingList());
        break;
    }
  });
  let ErrorList = Object.keys(errors);
  return (
    <Dialog
      style={{ minWidth: "30%" }}
      draggable
      resizable
      open={isOpen}
      header={
        <Bar className={styles["DialogHeader"]}>
          <Title level="H3">
            <strong>{dialogTitle}</strong>
          </Title>
        </Bar>
      }
      footer={
        <Bar
          startContent={
            <>
              {ErrorList.length > 0 ? (
                <ObjectStatus
                  active
                  inverted
                  state="Error"
                  children={
                    <span style={{ fontSize: "12px" }}>
                      <strong>
                        共有
                        {ErrorList.length}
                        處錯誤
                      </strong>
                    </span>
                  }
                />
              ) : null}
            </>
          }
          endContent={
            <>
              <Button
                onClick={() => {
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
        columnsS={2}
        style={{ background: "#f8fcfc" }}
      >
        {fieldName.map((item, idx) => (
          <FormItem
            label={
              <Label>
                {item.required === true ? (
                  <span style={{ color: "red" }}>*</span>
                ) : null}
                {item.label}
              </Label>
            }
            key={idx}
          >
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
                style={{ height: "34px", minWidth: "200px", outline: "none" }}
              >
                {item.options.map((element, idx) => (
                  <option key={idx} value={element.value}>
                    {element.label}
                  </option>
                ))}
              </select>
              // 下拉選單的編輯功能資料無法回填
              // <Controller
              //   control={control}
              //   name={item.name}
              //   rules={{ required: item.required }}
              //   render={({ field }) => {
              //     return (
              //       <Select
              //         {...register(item.name)}
              //         name={item.name}
              //         placeholder={item.placeholder}
              //         onChange={(event) => {
              //           field.onChange(event.detail.selectedOption.dataset.id);
              //         }}
              //         children={item.options.map((element, idx) => (
              //           <Option
              //             key={idx}
              //             data-id={element.value}
              //             {...field}
              //             value={element.value}
              //           >
              //             {element.label}
              //           </Option>
              //         ))}
              //       ></Select>
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
                    {...field}
                    placeholder={item.placeholder}
                    onChange={(event) => {
                      field.onChange(event.detail.value);
                    }}
                  />
                )}
              />
            )}
            {/* 複選框 */}
            {item.type === "checkbox" && (
              <div style={{ display: "flex", flexWrap: "wrap", width: "80%" }}>
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
                          valueState="Information"
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
                render={({ field: { onChange, value, name } }) => (
                  <Switch
                    className="ui5-content-density-compact"
                    design="Graphical"
                    {...register(item.name)}
                    onChange={(event) => {
                      // console.log(event.target.checked);
                      onChange(event.target.checked);
                    }}
                    checked={value}
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
