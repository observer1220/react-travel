export interface IField {
  label: string;
  placeholder?: string;
  name: string;
  type: string;
  options?: {
    label: string;
    value?: string;
    checked?: boolean;
  }[];
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMsg?: string;
}

export interface IProcessPending {
  id: number;
  purchaseOrderNo: string;
  purchaseOrderLine: string;
  orderType: string;
  orderNo: string;
  StandardTextCode: string;
  ProcessCode: string;
  ManufacturerCode: string;
  ProductName: string;
  ESTEndDate: string;
  ESTStartDate: string;
  ESTDeliveryDate: string;
  pickingStatus: boolean;
  inputQTY: number;
  completedQTY: number;
}

export interface ITodoList {
  id: number;
  todos: string;
  remarks: string;
  category: string;
  EstEndDate: string;
  trustee: any;
  phone: string;
  enabled: boolean;
  username: string;
}
