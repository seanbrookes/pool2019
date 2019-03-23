import React from 'react';

const SilentButton = (props) => {
  return (
    <button
      style={{border: '0', background: 'transparent'}}
      onClick={props.onClick}
    >
      {props.children}
    </button>

  )
};

export default SilentButton;
