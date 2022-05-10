import React from 'react';
import Select, { OnChangeValue, OptionProps, SingleValueProps, StylesConfig, components, ControlProps } from 'react-select';
import { ControllerRenderProps } from 'react-hook-form';
import { IDeliverableFormInput } from '../DeliverablePanel';
import { deliverablesExpenseKind, ExpenseKindState } from '../../../modules/deliverable';
import { EuroSvg } from '../../../assets/svg';

const clientStyles: StylesConfig<ExpenseKindState> = {
  container: styles => ({ ...styles, width: '100%' }),
  control: styles => ({ ...styles, backgroundColor: 'transparent', width: '100%', border: 'none', boxShadow: 'none' }),
  option: (styles, { isDisabled, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? '#DD0000' : undefined,
      color: isSelected ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
  input: styles => ({ ...styles, color: 'white' }),
  menuList: styles => ({ ...styles, padding: 0, margin: 0, borderRadius: '4px' }),
  placeholder: styles => ({ ...styles, color: 'white' }),
  singleValue: styles => ({ ...styles, color: 'white', textAlign: 'end' }),
};
const CustomOption = (props: OptionProps<ExpenseKindState, false>) => (
  <components.Option {...props}>
    <div className='flex flex-row'>
      <props.data.icon className='w-4 h-4 fill-rouge-blue mr-2' />
      <div>{props.data.label}</div>
    </div>
  </components.Option>
);
const CustomSingleValue = (props: SingleValueProps<ExpenseKindState, false>) => (
  <components.SingleValue {...props}>
    <div className='flex flex-row items-center'>
      <props.data.icon className='w-4 h-4 fill-white mr-2' />
      <div>{props.data.label}</div>
    </div>
  </components.SingleValue>
);
interface Props {
  field: ControllerRenderProps<IDeliverableFormInput, 'expensiveWhat'>;
}
function ExpensiveWhat({ field }: Props) {
  const handleChange = (newValue: OnChangeValue<ExpenseKindState, false>) => {
    field.onChange(newValue);
  };

  return (
    <div className='flex justify-between items-center py-1, text-white'>
      <span className='text-rouge-blue'>What:</span>
      <Select<ExpenseKindState>
        isClearable
        name={field.name}
        ref={field.ref}
        options={deliverablesExpenseKind}
        placeholder=''
        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
        styles={clientStyles}
        onChange={handleChange}
      />
    </div>
  );
}

export default ExpensiveWhat;
