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
import 'jsoneditor/dist/jsoneditor.min.css';

export default function Editor({ isLoading, setIsLoading, isOpen, onClose, data, setData, saveData }) {
  const [form] = Form.useForm();
  const [editorContainer, setEditorContainer] = useState(null);
  const [editor, setEditor] = useState(null);
  const [editorMode, setEditorMode] = useState('tree');
  const [tableData_member, setTableDataMember] = useState([]);
  const [tableData_menke, setTableDataMenke] = useState([]);
  const [editingKey, setEditingKey] = useState('');

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
    }
      
        // 更新原始数据
        const rawData = JSON.parse(data.data.toString());
        const memberIndex = rawData[type].value.findIndex(member => member[0] === key);
        if (memberIndex > -1) {
          if (type === 'MenKe_Now') {

            rawData[type].value[memberIndex][3] = row.age;
            rawData[type].value[memberIndex][4] = row.wen;
            rawData[type].value[memberIndex][6] = row.wu;
            rawData[type].value[memberIndex][7] = row.shang;
            rawData[type].value[memberIndex][8] = row.yi;
            rawData[type].value[memberIndex][15] = row.mou;
            rawData[type].value[memberIndex][18] = row.payment;
            // console.log(rawData, 'rawData menke') // TODO: Remove this debug info
            setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
            // let newData = JSON.stringify(rawData)
          } else if (type === 'Member_now') {
            const info = rawData[type].value[memberIndex][4].split('|')
            info[2] = row.talent;
            info[3] = row.talent_num;
            info[7] = row.lucky;
  
            // const old_name = info[0];
            rawData[type].value[memberIndex][4] = info.join('|');
            rawData[type].value[memberIndex][7] = row.wen;
            rawData[type].value[memberIndex][8] = row.wu;
            rawData[type].value[memberIndex][9] = row.shang;
            rawData[type].value[memberIndex][10] = row.yi;
            rawData[type].value[memberIndex][27] = row.mou;
            rawData[type].value[memberIndex][20] = row.beauty;
            let newData = JSON.stringify(rawData)
            setData({ ...data, data: Buffer.from(newData)});
            // }
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
      console.log(fields, 'fields')
      return {
        name: fields[4].split('|')[0], // 获取名字
        id: fields[0], // 成员ID
        wen: fields[7],
        wu: fields[8],
        shang: fields[9],
        yi: fields[10],
        mou: fields[27],
        talent: fields[4].split('|')[2],
        talent_num: fields[4].split('|')[3],
        lucky: fields[4].split('|')[7],
        beauty: fields[20],
      };
    });
    const menke_now = rawData?.MenKe_Now?.value || []
    // 门客
    const menke = menke_now.map(fields => {
      console.log(fields, 'fields')
      return {
        name: fields[2].split('|')[0], // 获取名字
        id: fields[0], // 成员ID
        age: fields[3], // 成员ID
        wen: fields[4],
        wu: fields[5],
        shang: fields[6],
        yi: fields[7],
        mou: fields[15],
        payment: fields[18],
      };
    });
    console.log(members, 'members') // TODO: Remove this debug inf
    setTableDataMember(members);
    setTableDataMenke(menke);

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
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: '文',
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: '武',
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: '商',
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
   
    {
      title: '艺',
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: '谋',
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: '幸运',
      dataIndex: 'lucky',
      key: 'lucky',
      editable: true,
    },
    {
      title: '魅力',
      dataIndex: 'beauty',
      key: 'beauty',
      editable: true,
    },
    {
      title: '天赋',
      dataIndex: 'talent',
      key: 'talent', 
      // editable: true,
      render: (text, record, index) => {
        const talentMap = {
          '1': '文',
          '2': '武', 
          '3': '商',
          '4': '艺',
          '0': '无'
        };
        const talent_dict = [
            { key: '1', value: '文', label: '文' },
            { key: '2', value: '武', label: '武' },
            { key: '3', value: '商', label: '商' },
            { key: '4', value: '艺', label: '艺' }
         
        ]
        return isEditing(record) ? (
          <Form.Item
            name="talent"
            style={{ margin: 0 }}
            // rules={[{ required: true, message: '请选择天赋!' }]}
          >
             <Radio.Group value={text}>
            <Radio value={'1'}>文</Radio>
            <Radio value={'2'}>武</Radio>
            <Radio value={'3'}>商</Radio>
            <Radio value={'4'}>艺</Radio>
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
      title: '天赋数值',
      dataIndex: 'talent_num',
      key: 'talent_num',
      editable: true,
    },
    {
      title: '操作',
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
              保存
            </Button>
            <Button onClick={cancel} size="small">
              取消
            </Button>
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small">
            编辑
          </Button>
        );
      },
    },
  ];
  const columns_menke = [
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: '文',
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: '武',
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: '商',
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
  
    {
      title: '艺',
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: '谋',
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: '每月薪酬',
      dataIndex: 'payment',
      key: 'payment',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return !editable && `￥${text}`
      }
    },
    {
      title: '操作',
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
              保存
            </Button>
            <Button onClick={cancel} size="small">
              取消
            </Button>
          </span>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small">
            编辑
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
                  家族成员列表
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
              </Box>
              <Heading size="md" mb="3">
                  门客列表
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
            保存到存档文件
          </Button>
          <Button
            ml='3'
            onClick={() => {
              setData(null);
              onClose();
            }}
            isDisabled={isLoading}
          >
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
