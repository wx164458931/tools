import React from "react";
import { Input, Checkbox, Radio } from 'antd';
import Markdown from "../../../component/markdown";
import Search from "../../../component/search";
import mdContent from './readme.md?raw';
import styles from './index.module.scss';

const SearchComponent: React.FC = () => {
  const search = Search.useSearch<{
    keywords: string,
    checkbox: string,
    radio: string
  }>()

  return (
    <div className={`article ${styles['demo-container']}`}>
      <div className={styles['markdown-wrapper']}>
        <Markdown
          md={mdContent}
        />
      </div>
      <div className={styles['demo-wrapper']}>
        <Search 
          style={{
            marginBottom: '16px'
          }} 
          onValueChange={(a, b) => {
            console.log('changeValue', a);
            console.log('allValues', b);
            console.log('serchvalues', search.getFieldsValue());
          }}
          search={search}
        >
          <Search.Item fixed label="文本输入框" name="keywords">
            <Input/>
          </Search.Item>
          <Search.Item fixed label="复选框" name="checkbox">
            <Checkbox.Group options={[
              { label: 'Apple', value: 'Apple' },
              { label: 'Pear', value: 'Pear' },
              { label: 'Orange', value: 'Orange' },
            ]} />
          </Search.Item>
          <Search.Item fixed label="单选框" name="radio">
            <Radio.Group options={[
              { label: 'Apple', value: 'Apple' },
              { label: 'Pear', value: 'Pear' },
              { label: 'Orange', value: 'Orange' },
            ]} />
          </Search.Item>
        </Search>
      </div>
    </div>
  );
}

export default SearchComponent