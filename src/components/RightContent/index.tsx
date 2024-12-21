import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';
import { createStyles } from 'antd-style';

export type SiderTheme = 'light' | 'dark';

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      color: token.colorWhite
    },
  };
});

export const SelectLang = () => {
  const { styles } = useStyles();
  return (
    <UmiSelectLang
      style={{
        padding: 4
      }}
      className={styles.container}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};
