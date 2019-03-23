import React from 'react';

const ProtectedStatusSelect = (props) => {
  return (
    <select value={props.status} onChange={props.onChange} {...props}>
      <option value="drafted">drafted</option>
      <option value="bubble">bubble</option>
      <option value="prospect">prospect</option>
      <option value="protected">protected</option>
      <option value="roster">roster</option>
      <option value="regular">regular</option>
      <option value="unprotected">unprotected</option>
    </select>
  );
};

export default ProtectedStatusSelect;
