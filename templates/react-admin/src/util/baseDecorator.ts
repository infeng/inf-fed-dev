export interface ValueText {
  value: any;
  text: string;
}

export class Field {
  name: string;
  text: string;
  constructor(name, text) {
    this.name = name;
    this.text = text;
  }

  message() {
    return `请输入${this.text}`;
  }
}

export function getFieldNames(formField) {
  let keys = Object.keys(formField);
  let names = [];
  keys.forEach(key => {
    let field = formField[key] as Field;
    names.push(field.name);
  });

  return names;
}

interface OptionDecorator {
  value: any;
  text: string;
}

export interface SelectDecorator {
  options: OptionDecorator[];
  defaultValue?: any;
}

export function getSelectFromEnum(arr: string[], defaultValue: any = undefined) {
  let options: OptionDecorator[] = [];
  let len = arr.length / 2;
  for (let i = 0; i < len; i++) {
    options.push({
      value: parseInt(arr[i], 0),
      text: arr[i + len],
    });
  }
  let select: SelectDecorator = {
    options: options,
    defaultValue: defaultValue,
  };

  return select;
}
