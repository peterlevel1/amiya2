import { AnyKeyProps } from '../types/AnyKeyProps';

export interface AyActionProps {
  /** 子元素 */
  children: string;
  /** 是否只在表格扩展显示 */
  tableFooterExtraOnly?: boolean;
  action?: 'add' | 'update' | 'delete' | 'batch-delete' | 'view' | string;
  record?: AnyKeyProps;
  inFinish?: (res: any) => void;
  params?: AnyKeyProps;
  [key: string]: any;
}
