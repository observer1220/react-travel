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
