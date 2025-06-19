import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text
} from '@chakra-ui/react';
import { Table, Input, Form, Button, message } from 'antd';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useLocale } from '../../lib/useLocale';
import { MEMBER_TYPES } from './constants';
import { 
  parseMemberData, 
  updateMemberInRawData, 
  maxAllMemberAttributes,
  setAllMemberAge18,
  maxAllMemberReputation,
  setMemberPregnant,
  getCurrencyData,
  getFoodData,
  removePunishment
} from './dataUtils';
import CurrencyManager from './CurrencyManager';
import FoodManager from './FoodManager';
import MemberTable from './MemberTable';

export default function Editor({ isLoading, setIsLoading, isOpen, onClose, data, setData, saveData }) {
  const [form] = Form.useForm();
  const { locale, t } = useLocale();

  // 表格数据状态
  const [tableData_member, setTableDataMember] = useState([]);
  const [tableData_menke, setTableDataMenke] = useState([]);
  const [tableData_qu, setTableDataQu] = useState([]);
  
  // 编辑状态
  const [editingKey, setEditingKey] = useState('');
  
  // 模态框状态
  const [pregnancyModal, setPregnancyModal] = useState({ isOpen: false, record: null, type: null });
  const [maxAllAttributesModal, setMaxAllAttributesModal] = useState({ isOpen: false, type: null });
  
  // 折叠状态
  const [collapseStates, setCollapseStates] = useState({
    member: true,
    qu: true,
    menke: true
  });
  
  // 货币和粮草状态
  const [money, setMoney] = useState('');
  const [yuanbao, setYuanbao] = useState('');
  const [food, setFood] = useState('0');
  const [vegetables, setVegetables] = useState('0');
  const [meat, setMeat] = useState('0');

  // 编辑相关函数
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

  // 保存成员数据
  const save = async (key, memberType) => {
    try {
      const row = await form.validateFields();
      
      // 更新表格数据
      let newData;
      if (memberType === MEMBER_TYPES.GUEST) {
        newData = [...tableData_menke];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          newData.splice(index, 1, { ...newData[index], ...row });
          setTableDataMenke(newData);
        }
      } else if (memberType === MEMBER_TYPES.FAMILY) {
        newData = [...tableData_member];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          newData.splice(index, 1, { ...newData[index], ...row });
          setTableDataMember(newData);
        }
      } else if (memberType === MEMBER_TYPES.SPOUSE) {
        newData = [...tableData_qu];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          newData.splice(index, 1, { ...newData[index], ...row });
          setTableDataQu(newData);
        }
      }
      
      // 更新原始数据
      const rawData = JSON.parse(data.data.toString());
      const updatedRawData = updateMemberInRawData(rawData, memberType, key, row);
      setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
      
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  // 批量操作函数
  const confirmMaxAllAttributes = (type) => {
    setMaxAllAttributesModal({ isOpen: true, type });
  };

  const executeMaxAllAttributes = () => {
    const type = maxAllAttributesModal.type;
    setMaxAllAttributesModal({ isOpen: false, type: null });
    
    const rawData = JSON.parse(data.data.toString());
    const updatedRawData = maxAllMemberAttributes(rawData, type);
    setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
    
    // 重新解析数据并更新表格
    updateAllTableData(updatedRawData);
    
    message.success({
      content: locale === 'zh' ? '全属性已升满！不要忘记保存到存档文件！' :
               locale === 'th' ? 'คุณสมบัติทั้งหมดได้รับการเพิ่มสูงสุดแล้ว! อย่าลืมบันทึกลงไฟล์!' :
               'All attributes maxed! Don\'t forget to save to file!',
      duration: 3
    });
  };

  const handleSetAllAge18 = (type) => {
    const rawData = JSON.parse(data.data.toString());
    const updatedRawData = setAllMemberAge18(rawData, type);
    setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
    
    updateAllTableData(updatedRawData);
    
    message.success({
      content: locale === 'zh' ? '全员年龄已设为18岁！不要忘记保存到存档文件！' :
               locale === 'th' ? 'อายุทุกคนถูกตั้งเป็น 18 ปีแล้ว! อย่าลืมบันทึกลงไฟล์!' :
               'All ages set to 18! Don\'t forget to save to file!',
      duration: 3
    });
  };

  const handleMaxAllReputation = (type) => {
    const rawData = JSON.parse(data.data.toString());
    const updatedRawData = maxAllMemberReputation(rawData, type);
    setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
    
    updateAllTableData(updatedRawData);
    
    message.success({
      content: locale === 'zh' ? '全员声誉已升满！不要忘记保存到存档文件！' :
               locale === 'th' ? 'ชื่อเสียงทุกคนได้รับการเพิ่มสูงสุดแล้ว! อย่าลืมบันทึกลงไฟล์!' :
               'All reputation maxed! Don\'t forget to save to file!',
      duration: 3
    });
  };

  const maxSingleMemberAttributes = (record, type) => {
    const rawData = JSON.parse(data.data.toString());
    // 这里可以复用批量操作的逻辑，但只对单个成员操作
    const updatedRawData = maxAllMemberAttributes({ ...rawData, [type]: { value: [rawData[type].value.find(m => m[0] === record.id)] } }, type);
    // 将更新后的成员数据放回原数据
    const memberIndex = rawData[type].value.findIndex(m => m[0] === record.id);
    if (memberIndex > -1) {
      rawData[type].value[memberIndex] = updatedRawData[type].value[0];
    }
    
    setData({ ...data, data: Buffer.from(JSON.stringify(rawData)) });
    updateAllTableData(rawData);
    
    message.success({
      content: locale === 'zh' ? `${record.name} 属性已升满！` :
               locale === 'th' ? `คุณสมบัติของ ${record.name} ได้รับการเพิ่มสูงสุดแล้ว!` :
               `${record.name} attributes maxed!`,
      duration: 2
    });
  };

  // 处理解除刑罚
  const handleRemovePunishment = (record, memberType) => {
    const rawData = JSON.parse(data.data.toString());
    const updatedRawData = removePunishment(rawData, memberType, record.id);
    setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
    
    updateAllTableData(updatedRawData);
    
    message.success({
      content: locale === 'zh' ? `${record.name} 刑罚已解除！` :
               locale === 'th' ? `การลงโทษของ ${record.name} ถูกยกเลิกแล้ว!` :
               `${record.name} punishment removed!`,
      duration: 2
    });
  };

  // 怀孕相关函数
  const handlePregnancy = (record, type) => {
    setPregnancyModal({ isOpen: true, record, type });
  };

  const confirmPregnancy = () => {
    const { record, type } = pregnancyModal;
    const rawData = JSON.parse(data.data.toString());
    const updatedRawData = setMemberPregnant(rawData, type, record.id);
    setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
    
    setPregnancyModal({ isOpen: false, record: null, type: null });
  };

  // 工具函数
  const updateAllTableData = (rawData) => {
    const members = parseMemberData(rawData, MEMBER_TYPES.FAMILY);
    const qu = parseMemberData(rawData, MEMBER_TYPES.SPOUSE);
    const menke = parseMemberData(rawData, MEMBER_TYPES.GUEST);
    
    setTableDataMember(members);
    setTableDataQu(qu);
    setTableDataMenke(menke);
  };

  const toggleCollapse = (section) => {
    setCollapseStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 可编辑单元格组件
  const EditableCell = useCallback(({
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
  }, []);

  // 初始化数据
  useEffect(() => {
    if (!data?.data) {
      return;
    }
    
    const rawData = JSON.parse(data.data.toString() || "{}");
    
    // 解析成员数据
    updateAllTableData(rawData);
    
    // 解析货币和粮草数据
    const currencyData = getCurrencyData(rawData);
    setMoney(currencyData.money);
    setYuanbao(currencyData.yuanbao);
    
    const foodData = getFoodData(rawData);
    setFood(foodData.food);
    setVegetables(foodData.vegetables);
    setMeat(foodData.meat);
  }, [data]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size='full' mt='20'>
        <ModalOverlay />
        <ModalContent>
          <ModalBody mt='5'>
            <Box display="flex" flexDirection="column" gap={4}>
              {/* 货币和粮草管理 */}
              <Box display="flex" gap={4}>
                <CurrencyManager
                  money={money}
                  yuanbao={yuanbao}
                  onUpdate={(newMoney, newYuanbao) => {
                    setMoney(newMoney);
                    setYuanbao(newYuanbao);
                  }}
                  data={data}
                  setData={setData}
                />
                <FoodManager
                  food={food}
                  vegetables={vegetables}
                  meat={meat}
                  onUpdate={(newFood, newVegetables, newMeat) => {
                    setFood(newFood);
                    setVegetables(newVegetables);
                    setMeat(newMeat);
                  }}
                  data={data}
                  setData={setData}
                />
              </Box>

              {/* 成员表格 */}
              <MemberTable
                title={t.familyMembers}
                memberType={MEMBER_TYPES.FAMILY}
                tableData={tableData_member}
                isCollapsed={!collapseStates.member}
                onToggleCollapse={() => toggleCollapse('member')}
                editingKey={editingKey}
                isEditing={isEditing}
                edit={edit}
                cancel={cancel}
                save={save}
                handlePregnancy={handlePregnancy}
                maxSingleMemberAttributes={maxSingleMemberAttributes}
                onMaxAllAttributes={confirmMaxAllAttributes}
                onMaxAllReputation={handleMaxAllReputation}
                onSetAllAge18={handleSetAllAge18}
                form={form}
                EditableCell={EditableCell}
                t={t}
                handleRemovePunishment={handleRemovePunishment}
              />

              <MemberTable
                title={t.familyqu}
                memberType={MEMBER_TYPES.SPOUSE}
                tableData={tableData_qu}
                isCollapsed={!collapseStates.qu}
                onToggleCollapse={() => toggleCollapse('qu')}
                editingKey={editingKey}
                isEditing={isEditing}
                edit={edit}
                cancel={cancel}
                save={save}
                handlePregnancy={handlePregnancy}
                maxSingleMemberAttributes={maxSingleMemberAttributes}
                onMaxAllAttributes={confirmMaxAllAttributes}
                onMaxAllReputation={handleMaxAllReputation}
                onSetAllAge18={handleSetAllAge18}
                form={form}
                EditableCell={EditableCell}
                t={t}
                handleRemovePunishment={handleRemovePunishment}
              />

              <MemberTable
                title={t.guests}
                memberType={MEMBER_TYPES.GUEST}
                tableData={tableData_menke}
                isCollapsed={!collapseStates.menke}
                onToggleCollapse={() => toggleCollapse('menke')}
                editingKey={editingKey}
                isEditing={isEditing}
                edit={edit}
                cancel={cancel}
                save={save}
                handlePregnancy={handlePregnancy}
                maxSingleMemberAttributes={maxSingleMemberAttributes}
                onMaxAllAttributes={confirmMaxAllAttributes}
                onMaxAllReputation={handleMaxAllReputation}
                onSetAllAge18={handleSetAllAge18}
                form={form}
                EditableCell={EditableCell}
                t={t}
                handleRemovePunishment={handleRemovePunishment}
              />
            </Box>
          </ModalBody>
          
          <ModalFooter style={{position: 'fixed', top: 0, right: 0}}>
            <Button
              colorScheme='orange'
              isDisabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                const isSaveSuccess = await saveData();
                setIsLoading(false);
                if (isSaveSuccess) onClose();
              }}
            >
              {locale === 'zh' ? '保存到存档文件' :
               locale === 'th' ? 'บันทึกลงไฟล์' :
               'Save to File'}
            </Button>
            <Button
              ml='3'
              onClick={() => {
                setData(null);
                onClose();
              }}
              isDisabled={isLoading}
            >
              {locale === 'zh' ? '关闭' :
               locale === 'th' ? 'ปิด' :
               'Close'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 立即受孕确认对话框 */}
      <Modal isOpen={pregnancyModal.isOpen} onClose={() => setPregnancyModal({ isOpen: false, record: null, type: null })} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {locale === 'zh' ? '立即怀孕确认' :
             locale === 'th' ? 'ยืนยันการตั้งครรภ์ทันที' :
             'Immediate Pregnancy Confirmation'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {locale === 'zh' ? '警告！' :
                   locale === 'th' ? 'คำเตือน!' :
                   'Warning!'}
                </AlertTitle>
                <AlertDescription>
                  {locale === 'zh' ? '请使用前先备份存档，以防造成无法挽回的影响！' :
                   locale === 'th' ? 'กรุณาสำรองไฟล์เซฟก่อนใช้งาน เพื่อป้องกันผลกระทบที่ไม่สามารถแก้ไขได้!' :
                   'Please backup your save file before use to prevent irreversible effects!'
                  }
                </AlertDescription>
              </Box>
            </Alert>
            <Text>
              {locale === 'zh' ? `确定要让 "${pregnancyModal.record?.name}" 立即怀孕吗？` :
               locale === 'th' ? `คุณแน่ใจหรือไม่ว่าต้องการให้ "${pregnancyModal.record?.name}" ตั้งครรภ์ทันที?` :
               `Are you sure you want "${pregnancyModal.record?.name}" to become pregnant immediately?`
              }
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              mr={3} 
              onClick={confirmPregnancy}
            >
              {locale === 'zh' ? '确认' :
               locale === 'th' ? 'ยืนยัน' :
               'Confirm'}
            </Button>
            <Button onClick={() => setPregnancyModal({ isOpen: false, record: null, type: null })}>
              {locale === 'zh' ? '取消' :
               locale === 'th' ? 'ยกเลิก' :
               'Cancel'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 全属性升满确认对话框 */}
      <Modal isOpen={maxAllAttributesModal.isOpen} onClose={() => setMaxAllAttributesModal({ isOpen: false, type: null })} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {locale === 'zh' ? '一键升满全属性确认' :
             locale === 'th' ? 'ยืนยันการเพิ่มคุณสมบัติทั้งหมดสูงสุด' :
             'Max All Attributes Confirmation'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {locale === 'zh' ? '重要提醒！' :
                   locale === 'th' ? 'คำเตือนสำคัญ!' :
                   'Important Warning!'}
                </AlertTitle>
                <AlertDescription>
                  {locale === 'zh' ? '如果列表中包含被贬成员，批量操作可能存在坏档风险！' :
                   locale === 'th' ? 'หากรายการมีสมาชิกที่ถูกลดตำแหน่ง การดำเนินการแบบกลุ่มอาจมีความเสี่ยงต่อการเสียหายของไฟล์เซฟ!' :
                   'If the list contains demoted members, batch operations may pose a save corruption risk!'
                  }
                </AlertDescription>
              </Box>
            </Alert>
            <Text>
              {locale === 'zh' ? '确定要对当前列表中的所有成员执行升满全属性操作吗？' :
               locale === 'th' ? 'คุณแน่ใจหรือไม่ว่าต้องการเพิ่มคุณสมบัติทั้งหมดสูงสุดสำหรับสมาชิกทั้งหมดในรายการปัจจุบัน?' :
               'Are you sure you want to max all attributes for all members in the current list?'
              }
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={executeMaxAllAttributes}
            >
              {locale === 'zh' ? '确认执行' :
               locale === 'th' ? 'ยืนยันดำเนินการ' :
               'Confirm'}
            </Button>
            <Button onClick={() => setMaxAllAttributesModal({ isOpen: false, type: null })}>
              {locale === 'zh' ? '取消' :
               locale === 'th' ? 'ยกเลิก' :
               'Cancel'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 