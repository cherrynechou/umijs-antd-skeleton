import { FC,  useEffect, useState } from 'react';
import { Button, Input, Space, Modal, Tabs, Radio, App } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useIntl } from '@umijs/max';
import Icon, { AppstoreOutlined } from '@ant-design/icons';
import * as icons from '@ant-design/icons';
import {
  directionOutlinedIcons,
  suggestionOutlinedIcons,
  editorOutlinedIcons,
  dataOutlinedIcons,
  logoOutlinedIcons,
  webOutlinedIcons
} from './iconData'
import { Tab } from "rc-tabs/lib/interface";


interface selectIconProps  {
  placeholder: string,
  onChange: (icon: string)=> void
}

const iconData  = [
  {'title': '方向性图标', key: 'direction', icons: directionOutlinedIcons},
  {'title': '提示建议性图标', key: 'suggestion', icons: suggestionOutlinedIcons},
  {'title': '编辑类图标', key: 'editor', icons: editorOutlinedIcons},
  {'title': '数据类图标', key: 'data', icons: dataOutlinedIcons},
  {'title': '品牌和标识', key: 'logo', icons: logoOutlinedIcons},
  {'title': '网站通用图标', key: 'web', icons: webOutlinedIcons},
];

const SelectIcon: FC<selectIconProps> = (props: any) =>{
  const [ currentIcon, setCurrentIcon ] = useState<string>('');
  const [viewData, setViewData] = useState<Tab[]>([])
  const [ isModalOpen, setIsModalOpen ] = useState<any>(false);

  const { message } = App.useApp();

  const intl = useIntl();

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setCurrentIcon(value);
  };

  useEffect(()=>{
    const iconViewData: Tab[] = [];
    iconData.forEach(item => {
      const childrenData = item.icons;
      iconViewData.push({
        key: item.key,
        label: item.title,
        children: (
          <Radio.Group>
            {
              childrenData.map((item: string,index: number) => {
                return (
                  <Radio.Button key={index} value={item} onChange={onChange}>
                    <Icon component={(icons as any)[item]} style={{fontSize: '16px'}}/>
                  </Radio.Button>
                )
              })
            }
          </Radio.Group>
        )
      })
    });

    setViewData(iconViewData)
  },[]);


  const handleOk = () =>{
    if(currentIcon === ''){
      message.error('请选择一个图标！')
    }
    props.onChange(currentIcon);
    setIsModalOpen(false);
  }

  const onCancel = () =>{
    setCurrentIcon('');
    setIsModalOpen(false);
  }


  return (
    <>
      <div className='flex items-center'>
        <Input
          style={{ width:200 }}
          placeholder={ props.placeholder }
          value={ props.value }
          prefix={ props.value && <Icon component={(icons as any)[props.value]} /> }
        />
        <Button
          type="primary"
          onClick={()=>{setIsModalOpen(!isModalOpen)}}
          style={{ borderRadius: 0 }}
        >
          <Space>
            <Icon component={ AppstoreOutlined  as React.ForwardRefExoticComponent<any>} />
          </Space>
        </Button>
      </div>

      <Modal
        destroyOnClose
        title={
          intl.formatMessage({id: 'component.selectIcon.title'})
        }
        open={isModalOpen}
        onCancel={() => onCancel()}
        onOk={handleOk}//提交图标关键字
        width={'60vw'}
      >
        <Tabs items={viewData}/>
      </Modal>
    </>
  )
}

export default SelectIcon;