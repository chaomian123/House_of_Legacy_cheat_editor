import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading
} from '@chakra-ui/react';
import { Table, Input, Form, Button, Radio } from 'antd';
import JSONEditor from 'jsoneditor';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useLocale } from '../lib/useLocale';
import 'jsoneditor/dist/jsoneditor.min.css';

export default function Editor({ isLoading, setIsLoading, isOpen, onClose, data, setData, saveData }) {
  const [form] = Form.useForm();
  const [editorContainer, setEditorContainer] = useState(null);
  const [editor, setEditor] = useState(null);
  const [editorMode, setEditorMode] = useState('tree');
  const [tableData_member, setTableDataMember] = useState([]);
  const [tableData_menke, setTableDataMenke] = useState([]);
  const [tableData_qu, setTableDataQu] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const { locale, t } = useLocale();

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      wen: '',
      wu: '',
      shang: '',
      yi: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key, type='Member_now') => {
    try {
      const row = await form.validateFields();
      let tableData
      if (type === 'MenKe_Now') {
        tableData = tableData_menke
        const newData = [...tableData];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableDataMenke(newData);
          setEditingKey('');
        }
      } else if (type === 'Member_now') {
        tableData = tableData_member
        const newData = [...tableData];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableDataMember(newData);
          setEditingKey('');
      }
    } else if (type === 'Member_qu') {
      tableData = tableData_qu
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTableDataQu(newData);
        setEditingKey('');
      }
    }
      
        // 更新原始数据
        const rawData = JSON.parse(data.data.toString());
        const memberIndex = rawData[type].value.findIndex(member => member[0] === key);
        if (memberIndex > -1) {
          if (type === 'MenKe_Now') {

            rawData[type].value[memberIndex][3] = row.age;
            rawData[type].value[memberIndex][4] = row.wen;
            rawData[type].value[memberIndex][5] = row.wu;
            rawData[type].value[memberIndex][6] = row.shang;
            rawData[type].value[memberIndex][7] = row.yi;
            rawData[type].value[memberIndex][15] = row.mou;
            rawData[type].value[memberIndex][18] = row.payment;
            // console.log(rawData, 'rawData menke') // TODO: Remove this debug info
            setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
            // let newData = JSON.stringify(rawData)
          } else if (type === 'Member_now') {
            const zuzhangInfo = rawData['Member_First'].value[0]
            const zuzhangAge = zuzhangInfo[6]
            const zuzhangId = zuzhangInfo[0]
            const ID = rawData[type].value[memberIndex][0]
            if (ID === zuzhangId) {
              rawData['Member_First'].value[0][6] = row.age
            }
            const info = rawData[type].value[memberIndex][4].split('|')
            info[2] = row.talent;
            info[3] = row.talent_num;
            info[6] = row.skill || '0';
            info[7] = row.lucky;
  
            // const old_name = info[0];
            rawData[type].value[memberIndex][4] = info.join('|');
            rawData[type].value[memberIndex][7] = row.wen;
            rawData[type].value[memberIndex][6] = row.age;
            rawData[type].value[memberIndex][8] = row.wu;
            rawData[type].value[memberIndex][9] = row.shang;
            rawData[type].value[memberIndex][10] = row.yi;
            rawData[type].value[memberIndex][27] = row.mou;
            rawData[type].value[memberIndex][20] = row.beauty;
            rawData[type].value[memberIndex][33] = row.skill_num;
            let newData = JSON.stringify(rawData)
            setData({ ...data, data: Buffer.from(newData)});
            // }
          } else if (type === 'Member_qu') {
            const info = rawData[type].value[memberIndex][2].split('|')
            info[2] = row.talent;
            info[3] = row.talent_num;
            info[6] = row.skill || '0';
            info[7] = row.lucky;
            rawData[type].value[memberIndex][2] = info.join('|');
            rawData[type].value[memberIndex][5] = row.age;
            rawData[type].value[memberIndex][6] = row.wen;
            rawData[type].value[memberIndex][7] = row.wu;
            rawData[type].value[memberIndex][8] = row.shang;
            rawData[type].value[memberIndex][9] = row.yi;
            rawData[type].value[memberIndex][19] = row.mou;
            rawData[type].value[memberIndex][15] = row.beauty;
            rawData[type].value[memberIndex][23] = row.skill_num;
            let newData = JSON.stringify(rawData)
            setData({ ...data, data: Buffer.from(newData)});
          }
        
          
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  useEffect(() => {
    // if (!editorContainer || !data)
    //   return;
    const rawData = JSON.parse(data?.data?.toString()  || "{}")
    const member_now = rawData?.Member_now?.value || []
    // console.log(rawData, 'tableData')
    const members = member_now.map(fields => {
      return {
        name: fields[4].split('|')[0], // 获取名字
        id: fields[0], // 成员ID
        age: fields[6],
        wen: fields[7],
        wu: fields[8],
        shang: fields[9],
        yi: fields[10],
        mou: fields[27],
        talent: fields[4].split('|')[2],
        talent_num: fields[4].split('|')[3],
        skill: fields[4].split('|')[6] || '0', // 技能，默认为0
        skill_num: fields[33] || '0', // 技能数值，默认为0
        lucky: fields[4].split('|')[7],
        beauty: fields[20],
      };
    });
    const qu_now = rawData?.Member_qu?.value || []
    // console.log(rawData, 'tableData')
    const qu = qu_now.map(fields => {
      // console.log(fields, 'fields')
      return {
        name: fields[2].split('|')[0], // 获取名字
        id: fields[0], // 成员ID
        age: fields[5],
        wen: fields[6],
        wu: fields[7],
        shang: fields[8],
        yi: fields[9],
        mou: fields[19],
        talent: fields[2].split('|')[2],
        talent_num: fields[2].split('|')[3],
        skill: fields[2].split('|')[6] || '0', // 技能，默认为0
        skill_num: fields[23], // 技能数值，默认为0
        lucky: fields[2].split('|')[7],
        beauty: fields[15],
      };
    });
    const menke_now = rawData?.MenKe_Now?.value || []
    // 门客
    const menke = menke_now.map(fields => {
      return {
        name: fields[2].split('|')[0], // 获取名字
        id: fields[0], // 成员ID
        age: fields[3], // 成员ID
        wen: fields[4],
        wu: fields[5],
        shang: fields[6],
        yi: fields[7],
        mou: fields[15],
        // skill: fields[2].split('|')[4] || '0', // 技能，默认为0
        // skill_num: fields[2].split('|')[5] || '0', // 技能数值，默认为0
        payment: fields[18],
      };
    });
    // console.log(members, 'members') // TODO: Remove this debug inf
    setTableDataMember(members);
    setTableDataMenke(menke);
    setTableDataQu(qu);

    return () => {
      setEditor(null);
    };
  }, [editorContainer, data, isLoading, editorMode]); // Add editorMode to dependency array

  useEffect(() => {
  }, [isLoading, editor, editorMode]); // Add editorMode to dependency array

  const editorContainerRef = useCallback(node => {
    if (node)
      setEditorContainer(node);
  }, []);

  const columns_member = [
    {
      title: locale === 'zh' ? '名字' : 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: t.attributes.age,
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: t.attributes.literature,
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: t.attributes.martial,
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: t.attributes.commerce,
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
   
    {
      title: t.attributes.art,
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: t.attributes.strategy,
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: t.attributes.luck,
      dataIndex: 'lucky',
      key: 'lucky',
      editable: true,
    },
    {
      title: t.attributes.charm,
      dataIndex: 'beauty',
      key: 'beauty',
      editable: true,
    },
    {
      title: t.attributes.talent,
      dataIndex: 'talent',
      key: 'talent', 
      // editable: true,
      render: (text, record, index) => {
        const talentMap = locale === 'zh' ? {
          '1': '文',
          '2': '武', 
          '3': '商',
          '4': '艺',
          '0': '无'
        } : {
          '1': 'Literature',
          '2': 'Martial', 
          '3': 'Commerce',
          '4': 'Art',
          '0': 'None'
        };
        const talent_dict = locale === 'zh' ? [
            { key: '1', value: '文', label: '文' },
            { key: '2', value: '武', label: '武' },
            { key: '3', value: '商', label: '商' },
            { key: '4', value: '艺', label: '艺' }
        ] : [
            { key: '1', value: 'Literature', label: 'Literature' },
            { key: '2', value: 'Martial', label: 'Martial' },
            { key: '3', value: 'Commerce', label: 'Commerce' },
            { key: '4', value: 'Art', label: 'Art' }
        ];
        return isEditing(record) ? (
          <Form.Item
            name="talent"
            style={{ margin: 0 }}
            // rules={[{ required: true, message: '请选择天赋!' }]}
          >
             <Radio.Group value={text}>
            <Radio value={'1'}>{locale === 'zh' ? '文' : 'Literature'}</Radio>
            <Radio value={'2'}>{locale === 'zh' ? '武' : 'Martial'}</Radio>
            <Radio value={'3'}>{locale === 'zh' ? '商' : 'Commerce'}</Radio>
            <Radio value={'4'}>{locale === 'zh' ? '艺' : 'Art'}</Radio>
          </Radio.Group>
            {/* <Select>
              {talent_dict.map(({key, value, label}) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select> */}
            {/* {console.log(Object.entries(talentMap))} */}
          </Form.Item>
        ) : (
          talentMap[text] || text
        );
      }
    },
    {
      title: locale === 'zh' ? '天赋数值' : 'Talent Value',
      dataIndex: 'talent_num',
      key: 'talent_num',
      editable: true,
    },
    {
      title: t.attributes.skill,
      dataIndex: 'skill',
      key: 'skill',
      render: (text, record, index) => {
        const skillMap = locale === 'zh' ? {
          '0': '无',
          '2': '医'
        } : {
          '0': 'None',
          '2': 'Medical'
        };
        
        return isEditing(record) ? (
          <Form.Item
            name="skill"
            style={{ margin: 0 }}
          >
            <Radio.Group value={text}>
              <Radio value={'0'}>{locale === 'zh' ? '无' : 'None'}</Radio>
              <Radio value={'2'}>{locale === 'zh' ? '医' : 'Medical'}</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          skillMap[text] || text
        );
      }
    },
    {
      title: t.attributes.skillValue,
      dataIndex: 'skill_num',
      key: 'skill_num',
      editable: true,
    },
    {
      title: locale === 'zh' ? '操作' : 'Actions',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.id, 'Member_now')}
              style={{ marginRight: 8 }}
              size="small"
            >
              {t.save}
            </Button>
            <Button onClick={cancel} size="small">
              {t.cancel}
            </Button>
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small">
            {t.edit}
          </Button>
        );
      },
    },
  ];
  const columns_qu = [
    {
      title: locale === 'zh' ? '名字' : 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: t.attributes.age,
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: t.attributes.literature,
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: t.attributes.martial,
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: t.attributes.commerce,
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
   
    {
      title: t.attributes.art,
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: t.attributes.strategy,
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: t.attributes.luck,
      dataIndex: 'lucky',
      key: 'lucky',
      editable: true,
    },
    {
      title: t.attributes.charm,
      dataIndex: 'beauty',
      key: 'beauty',
      editable: true,
    },
    {
      title: t.attributes.talent,
      dataIndex: 'talent',
      key: 'talent', 
      // editable: true,
      render: (text, record, index) => {
        const talentMap = locale === 'zh' ? {
          '1': '文',
          '2': '武', 
          '3': '商',
          '4': '艺',
          '0': '无'
        } : {
          '1': 'Literature',
          '2': 'Martial', 
          '3': 'Commerce',
          '4': 'Art',
          '0': 'None'
        };
        const talent_dict = locale === 'zh' ? [
            { key: '1', value: '文', label: '文' },
            { key: '2', value: '武', label: '武' },
            { key: '3', value: '商', label: '商' },
            { key: '4', value: '艺', label: '艺' }
        ] : [
            { key: '1', value: 'Literature', label: 'Literature' },
            { key: '2', value: 'Martial', label: 'Martial' },
            { key: '3', value: 'Commerce', label: 'Commerce' },
            { key: '4', value: 'Art', label: 'Art' }
        ];
        return isEditing(record) ? (
          <Form.Item
            name="talent"
            style={{ margin: 0 }}
            // rules={[{ required: true, message: '请选择天赋!' }]}
          >
             <Radio.Group value={text}>
            <Radio value={'1'}>{locale === 'zh' ? '文' : 'Literature'}</Radio>
            <Radio value={'2'}>{locale === 'zh' ? '武' : 'Martial'}</Radio>
            <Radio value={'3'}>{locale === 'zh' ? '商' : 'Commerce'}</Radio>
            <Radio value={'4'}>{locale === 'zh' ? '艺' : 'Art'}</Radio>
          </Radio.Group>
            {/* <Select>
              {talent_dict.map(({key, value, label}) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select> */}
            {/* {console.log(Object.entries(talentMap))} */}
          </Form.Item>
        ) : (
          talentMap[text] || text
        );
      }
    },
    {
      title: locale === 'zh' ? '天赋数值' : 'Talent Value',
      dataIndex: 'talent_num',
      key: 'talent_num',
      editable: true,
    },
    {
      title: t.attributes.skill,
      dataIndex: 'skill',
      key: 'skill',
      render: (text, record, index) => {
        const skillMap = locale === 'zh' ? {
          '0': '无',
          '2': '医'
        } : {
          '0': 'None',
          '2': 'Medical'
        };
        
        return isEditing(record) ? (
          <Form.Item
            name="skill"
            style={{ margin: 0 }}
          >
            <Radio.Group value={text}>
              <Radio value={'0'}>{locale === 'zh' ? '无' : 'None'}</Radio>
              <Radio value={'2'}>{locale === 'zh' ? '医' : 'Medical'}</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          skillMap[text] || text
        );
      }
    },
    {
      title: t.attributes.skillValue,
      dataIndex: 'skill_num',
      key: 'skill_num',
      editable: true,
    },
    {
      title: locale === 'zh' ? '操作' : 'Actions',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.id, 'Member_qu')}
              style={{ marginRight: 8 }}
              size="small"
            >
              {t.save}
            </Button>
            <Button onClick={cancel} size="small">
              {t.cancel}
            </Button>
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small">
            {t.edit}
          </Button>
        );
      },
    },
  ];
  const columns_menke = [
    {
      title: locale === 'zh' ? '名字' : 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: t.attributes.age,
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: t.attributes.literature,
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: t.attributes.martial,
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: t.attributes.commerce,
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
  
    {
      title: t.attributes.art,
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: t.attributes.strategy,
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: locale === 'zh' ? '每月薪酬' : 'Monthly Salary',
      dataIndex: 'payment',
      key: 'payment',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return !editable && `${locale === 'zh' ? '￥' : '$'}${text}`
      }
    },
    {
      title: locale === 'zh' ? '操作' : 'Actions',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.id, 'MenKe_Now')}
              style={{ marginRight: 8 }}
              size="small"
            >
              {t.save}
            </Button>
            <Button onClick={cancel} size="small">
              {t.cancel}
            </Button>
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small">
            {t.edit}
          </Button>
        );
      },
    },
  ];

  const mergedColumns_member = columns_member.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const mergedColumns_qu = columns_qu.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const mergedColumns_menke = columns_menke.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  })
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='full' mt='20'>
      <ModalOverlay />
      <ModalContent>
        {/* <ModalHeader>Editor</ModalHeader> */}
        <ModalBody mt='5'>
         
            <Box display="flex" flexDirection="column" gap={4}>
              <Box>
                  <Heading size="md" mb="3">
                  {t.familyMembers}
                    </Heading>
                    <Form form={form} component={false}>
                      <Table
                        components={{
                          body: {
                            cell: EditableCell,
                          },
                        }}
                        dataSource={tableData_member}
                        columns={mergedColumns_member}
                        rowKey="id"
                        bordered
                        size="middle"
                        rowClassName="editable-row"
                        pagination={false}
                      />
                    </Form>
                    <Heading size="md" mb="3">
                  {t.familyqu}
                    </Heading>
                    <Form form={form} component={false}>
                      <Table
                        components={{
                          body: {
                            cell: EditableCell,
                          },
                        }}
                        dataSource={tableData_qu}
                        columns={mergedColumns_qu}
                        rowKey="id"
                        bordered
                        size="middle"
                        rowClassName="editable-row"
                        pagination={false}
                      />
                    </Form>
              </Box>
              <Heading size="md" mb="3">
                  {t.guests}
                    </Heading>
              <Form form={form} component={false}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  dataSource={tableData_menke}
                  columns={mergedColumns_menke}
                  rowKey="id"
                  bordered
                  size="middle"
                  rowClassName="editable-row"
                  pagination={false}
                />
              </Form>
          </Box>
    
        </ModalBody>
        <ModalFooter style={{position: 'fixed', top: 0, right: 0}} >
          <Button
            colorScheme='orange'
            isDisabled={isLoading}
            onClick={async () => {
              setIsLoading(true);

              const isSaveSuccess = await saveData();
              setIsLoading(false);

              if (isSaveSuccess)
                onClose();
            }}
          >
            {locale === 'zh' ? '保存到存档文件' : 'Save to File'}
          </Button>
          <Button
            ml='3'
            onClick={() => {
              setData(null);
              onClose();
            }}
            isDisabled={isLoading}
          >
            {locale === 'zh' ? '关闭' : 'Close'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
