import * as React from 'react';

/**
 * 获取组件名称（将首字母大写）
 * @param componentName 组件名称（首字母没有大写）
 * @return 组件名称
 */
export function getComponentName(componentName: string): string {
  return componentName.replace(/(\w)/, v => v.toUpperCase());
}

export function renderColumnHeader(text) {
  return <span className="text-bold">{text}</span>;
}

import moment from 'moment';
export function formatDate(date) {
  return date ? moment(date) : undefined;
}

/**
 * 格式化返回类型为number的值，用于InputNumber组件
 * @param value 返回类型为number的值
 * @result 格式化后的值
 */
export function formatNumber(value: any): any {
  if (typeof value === 'undefined' || value === null) {
    return undefined;
  }else {
    return value;
  }
}

export function formatMoney(money: number, showUnit = true) {
  if (money !== null) {
    return `${money}${showUnit ? '元' : ''}`;
  }
  return '';
}
