import Select, { StylesConfig } from 'react-select';
import { SelectOpionState } from '../../modules/common';

export const colourStyles: StylesConfig<SelectOpionState> = {
  container: styles => ({ ...styles, display: 'flex', flex: 1 }),
  control: styles => ({ ...styles, backgroundColor: 'transparent', display: 'flex', flex: 1, border: 'none', boxShadow: 'none' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected ? '#DD0000' : undefined,
      color: data.isLinked === null ? 'blue' : isSelected ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
  input: styles => ({ ...styles, color: 'white' }),
  menuList: styles => ({ ...styles, padding: 0, margin: 0, borderRadius: '4px' }),
  placeholder: styles => ({ ...styles, color: 'white' }),
  singleValue: (styles, { data }) => ({ ...styles, color: '#DD0000', textAlign: 'end' }),
};
