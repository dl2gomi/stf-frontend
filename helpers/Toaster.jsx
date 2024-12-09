import React from 'react';
import { toast } from 'react-toastify';

const Toaster = {
  success: (title, contents) => {
    toast.success(
      <div>
        <div style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>{title}</div>
        {contents?.map((content, index) => (
          <div key={index} style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  },

  error: (title, contents) => {
    toast.error(
      <div>
        <div style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>{title}</div>
        {contents?.map((content, index) => (
          <div key={index} style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  },

  info: (title, contents) => {
    toast.info(
      <div>
        <div style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>{title}</div>
        {contents?.map((content, index) => (
          <div key={index} style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  },

  warning: (title, contents) => {
    toast.warning(
      <div>
        <div style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>{title}</div>
        {contents?.map((content, index) => (
          <div key={index} style={{ lineHeight: '24px', fontSize: '16px', fontWeight: 'bold' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  },
};

export default Toaster;
