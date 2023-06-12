import { AnyKeyProps } from '@/types/AnyKeyProps';
import { AyFormField } from '../AyForm/ay-form';
import { ExtendField } from '../AySearchTable/ay-search-table';

export interface AySearchProps {
  fields: Array<AySearchField>;
  onConfirm?(values: AnyKeyProps): void;
  /**
   * 是否展示切换按钮
   */
  showToggleBtn?: () => boolean;

  onToggleBtnChange?: (val: boolean) => void;
}

export interface AySearchField extends AyFormField {
  search?: ExtendField;
  [key: string]: any;
}
