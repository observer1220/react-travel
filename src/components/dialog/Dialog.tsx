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
                        ??????
                        {ErrorList.length}
                        ?????????
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
                ??????
              </Button>
              <Button
                onClick={() => {
                  onChangeStatus(false);
                }}
              >
                ??????
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
            key={item.name}
          >
            {/* ??????????????? */}
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
            {/* ??????????????? */}
            {item.type === "textarea" && (
              <TextArea
                {...register(item.name, {
                  required: item.required,
                  pattern: item.pattern,
                })}
                placeholder={item.placeholder}
              />
            )}
            {/* ???????????? */}
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
              // ?????????????????????????????????????????????
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
            {/* ???????????? */}
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
            {/* ????????? */}
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
            {/* ????????? */}
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
            {/* ???????????? */}
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
            {/* ???????????? */}
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors[item.name]?.type === "required" && (
                <p>{item.label}????????????</p>
              )}
              {errors[item.name]?.type === "pattern" && (
                <p>{item.patternMsg}</p>
              )}
              {errors[item.name]?.type === "minLength" && (
                <p>????????????{item.minLength}??????</p>
              )}
              {errors[item.name]?.type === "maxLength" && (
                <p>????????????{item.maxLength}??????</p>
              )}
              {errors[item.name]?.type === "min" && <p>????????????{item.min}</p>}
              {errors[item.name]?.type === "max" && <p>????????????{item.max}</p>}
            </div>
          </FormItem>
        ))}
      </Form>
    </Dialog>
  );
};
