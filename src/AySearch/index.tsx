import React, {
  useState,
  MutableRefObject,
  useRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
} from 'react';
import AyForm from '../AyForm';
import AyButton from '../AyButton';
import { Form, Col, Space, Card } from 'antd';
import { AyFormField } from '../AyForm/ay-form';
import { AySearchField, AySearchProps } from './ay-search';
import { AnyKeyProps } from '../types/AnyKeyProps';
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

const MIN_UNFOLDED_LENGTH = 5;

/**
 * 获取 field 当前的位置，默认位置是 1，越往前越靠前
 * @param field form 配置项
 */
const getOrder = (field: any): number => {
  return field.order === undefined ? 1 : field.order;
};

/**
 * 将查询的 field 转成 form 的field
 * @param fields 查询配置项
 * @param mini 是否缩小
 */
const getSearchFields = (fields: Array<AySearchField>, mini: boolean): Array<AyFormField> => {
  let newFields: Array<AyFormField> = fields.map((field, i) => {
    let newField: AyFormField = {
      ...field,
      // 生成 order
      order: getOrder(field),
    };
    // 获取展开缩小时的 field
    if (mini) {
      newField.hidden = i > 4;
    }
    return newField;
  });
  // 排序
  newFields.sort((a: any, b: any) => {
    return b.order - a.order;
  });
  return newFields;
};

const getMiniLabel = (mini: boolean) => {
  return mini ? '展开' : '收缩';
};

/**
 * ant form 原生支持的方法尽数暴露出去
 */
const funcs = [
  'getFieldValue',
  'getFieldsValue',
  'getFieldError',
  'getFieldsError',
  'isFieldTouched',
  'isFieldsTouched',
  'isFieldValidating',
  'resetFields',
  'scrollToField',
  'setFields',
  'setFieldsValue',
  'submit',
  'validateFields',
];

export default forwardRef(function AySearch(props: AySearchProps, ref) {
  const { fields, onConfirm, showToggleBtn, onToggleBtnChange } = props;
  const [mini, setMini] = useState<boolean>(true);
  const searchFields: Array<AyFormField> = getSearchFields(fields, mini);

  /** 控制 any form 的实例 */
  const formRef: MutableRefObject<any> = useRef();
  /** 暴露出去的 form 的实例，允许父组件通过 ref 调用方法 */
  const formInstans: AnyKeyProps = {};
  /** 填充方法 */
  funcs.forEach((func) => {
    formInstans[func] = (...args: any) => formRef.current[func](...args);
  });
  useImperativeHandle(ref, () => formInstans);

  const toggleMini = () => {
    const val = !mini;
    setMini(val);

    if (onToggleBtnChange) {
      onToggleBtnChange(val);
    }
  };

  useLayoutEffect(() => {
    if (onToggleBtnChange) {
      onToggleBtnChange(mini);
    }
  }, []);

  /**
   * 重置
   */
  const handleReset = () => {
    formRef.current.resetFields();
    formRef.current.submit();
  };

  /**
   * 提交查询
   * @param values 返回参数
   */
  const handleConfirm = (values: AnyKeyProps) => {
    if (onConfirm) {
      onConfirm(values);
    }
  };

  /**
   * 展开缩小切换
   */
  const toggleBtn = !(showToggleBtn
    ? showToggleBtn()
    : fields.length >= MIN_UNFOLDED_LENGTH) ? null : (
    <AyButton type="link" onClick={toggleMini}>
      {getMiniLabel(mini)}
      {mini ? <DownOutlined /> : <UpOutlined />}
    </AyButton>
  );

  return (
    <Card className="ay-search">
      <AyForm ref={formRef} fields={searchFields} span={8} onConfirm={handleConfirm}>
        <Col span={8}>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <AyButton htmlType="submit" type="primary" icon={<SearchOutlined />}>
                查询
              </AyButton>
              <AyButton icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </AyButton>
              {toggleBtn}
            </Space>
          </Form.Item>
        </Col>
      </AyForm>
    </Card>
  );
});
