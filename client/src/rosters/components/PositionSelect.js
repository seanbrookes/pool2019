import React from 'react';

const ProtectedStatusSelect = (props) => {
  return (
    <select value={props.position} onChange={props.onChange} {...props} >
      <option value="C">C</option>
      <option value="1B">1B</option>
      <option value="2B">2B</option>
      <option value="3B">3B</option>
      <option value="SS">SS</option>
      <option value="LF">LF</option>
      <option value="CF">CF</option>
      <option value="RF">RF</option>
      <option value="DH">DH</option>
      <option value="SP">SP</option>
      <option value="RP">RP</option>
    </select>
  );
};

export default ProtectedStatusSelect;
