import { useAppDispatch } from "../../redux/hooks";
import {
  Button,
  ComboBox,
  ComboBoxItem,
  DateRangePicker,
  FilterBar,
  FilterGroupItem,
  Input,
  MultiComboBox,
  MultiComboBoxItem,
  MultiInput,
  Option,
  RatingIndicator,
  Select,
  StepInput,
  Switch,
  Title,
  Token,
} from "@ui5/webcomponents-react";

interface PropsType {
  fieldName: any;
  // isOpen: boolean;
  // onChangeStatus: React.Dispatch<React.SetStateAction<boolean>>;
  // data: any;
  // pageName: string;
}

export const MultiSearchComponent: React.FC<PropsType> = (fieldName) => {
  // const dispatch = useAppDispatch();
  console.log(fieldName);

  return (
    <FilterBar
      header={<Title>Test</Title>}
      onAfterFiltersDialogOpen={function noRefCheck() {}}
      onClear={function noRefCheck() {}}
      onFiltersDialogCancel={function noRefCheck() {}}
      onFiltersDialogClose={function noRefCheck() {}}
      onFiltersDialogOpen={function noRefCheck() {}}
      onFiltersDialogSave={function noRefCheck() {}}
      onFiltersDialogSearch={function noRefCheck() {}}
      onFiltersDialogSelectionChange={function noRefCheck() {}}
      onGo={function noRefCheck() {}}
      onRestore={function noRefCheck() {}}
      onToggleFilters={function noRefCheck() {}}
      search={<Input placeholder="Search" />}
    >
      <FilterGroupItem label="StepInput">
        <StepInput />
      </FilterGroupItem>
      <FilterGroupItem label="RatingIndicator" required>
        <RatingIndicator />
      </FilterGroupItem>
      <FilterGroupItem active label="MultiInput">
        <MultiInput
          tokens={
            <>
              <Token selected text="Argentina" />
              <Token text="Bulgaria" />
              <Token text="England" />
              <Token text="Finland" />
            </>
          }
        />
      </FilterGroupItem>
      <FilterGroupItem label="Input">
        <Input placeholder="Placeholder" />
      </FilterGroupItem>
      <FilterGroupItem label="Switch">
        <Switch />
      </FilterGroupItem>
      <FilterGroupItem label="SELECT w/ initial selected">
        <Select>
          <Option>Option 1</Option>
          <Option selected>Option 2</Option>
          <Option>Option 3</Option>
          <Option>Option 4</Option>
        </Select>
      </FilterGroupItem>
      <FilterGroupItem label="SELECT w/o initial selected">
        <Select>
          <Option data-key="Test 1" icon="add" selected>
            Test 1
          </Option>
          <Option data-key="Test 2" icon="add">
            Test 2
          </Option>
          <Option data-key="Test 3" icon="add">
            Test 3
          </Option>
          <Option data-key="Test 4" icon="add">
            Test 4
          </Option>
          <Option data-key="Test 5" icon="add">
            Test 5
          </Option>
        </Select>
      </FilterGroupItem>
      <FilterGroupItem groupName="Group 1" label="MultBox w/ initial selected">
        <MultiComboBox>
          <MultiComboBoxItem text="MultiComboBoxItem 1" />
          <MultiComboBoxItem selected text="MultiComboBoxItem 2" />
          <MultiComboBoxItem text="MultiComboBoxItem 3" />
          <MultiComboBoxItem selected text="MultiComboBoxItem 4" />
        </MultiComboBox>
      </FilterGroupItem>
      <FilterGroupItem
        groupName="Group 2"
        label="ComboBox w/o initial selected"
      >
        <ComboBox>
          <ComboBoxItem text="ComboBoxItem 1" />
          <ComboBoxItem text="ComboBoxItem 2" />
          <ComboBoxItem text="ComboBoxItem 3" />
          <ComboBoxItem text="ComboBoxItem 4" />
        </ComboBox>
      </FilterGroupItem>
      <FilterGroupItem groupName="Group 2" label="Date Picker">
        <DateRangePicker
          style={{
            minWidth: "auto",
          }}
        />
      </FilterGroupItem>
      <Button
        onClick={() => {
          console.log();
        }}
      />
    </FilterBar>
  );
};
