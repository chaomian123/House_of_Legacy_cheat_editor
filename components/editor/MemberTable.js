import { Box, Heading, Collapse } from '@chakra-ui/react';
import { Table, Form, Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useLocale } from '../../lib/useLocale';
import { createTableColumns, createMergedColumns } from './tableColumns';
import { MEMBER_TYPES } from './constants';

const MemberTable = ({
  title,
  memberType,
  tableData,
  isCollapsed,
  onToggleCollapse,
  editingKey,
  isEditing,
  edit,
  cancel,
  save,
  handlePregnancy,
  maxSingleMemberAttributes,
  onMaxAllAttributes,
  onMaxAllReputation,
  onSetAllAge18,
  form,
  EditableCell,
  t,
  handleRemovePunishment
}) => {
  const { locale } = useLocale();

  const columns = useMemo(() => 
    createTableColumns(
      locale,
      t,
      isEditing,
      edit,
      cancel,
      save,
      handlePregnancy,
      maxSingleMemberAttributes,
      memberType,
      editingKey,
      handleRemovePunishment
    ),
    [locale, t, isEditing, edit, cancel, save, handlePregnancy, maxSingleMemberAttributes, memberType, editingKey, handleRemovePunishment]
  );

  const mergedColumns = useMemo(() => 
    createMergedColumns(columns, isEditing),
    [columns, isEditing]
  );

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb="3">
        <Box display="flex" alignItems="center" gap="2">
          <Button
            size="small"
            icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
            onClick={onToggleCollapse}
            aria-label={`Toggle ${title}`}
          />
          <Heading size="md">
            {title}
          </Heading>
        </Box>
        <Box display="flex" gap="2">
          <Button 
            size="small" 
            onClick={() => onMaxAllReputation(memberType)}
          >
            {t.maxAllReputation}
          </Button>
          <Button 
            size="small" 
            onClick={() => onSetAllAge18(memberType)}
          >
            {t.setAllAge18}
          </Button>
          <Button 
            type="primary" 
            size="small" 
            onClick={() => onMaxAllAttributes(memberType)}
          >
            {locale === 'zh' ? '升满全属性' : 'Max All Attributes'}
          </Button>
        </Box>
      </Box>
      <Collapse in={!isCollapsed}>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={tableData}
            columns={mergedColumns}
            rowKey="id"
            bordered
            size="middle"
            rowClassName="editable-row"
            pagination={false}
            // scroll={{ y: 400 }}
            style={{ minHeight: '400px' }}
          />
        </Form>
      </Collapse>
    </Box>
  );
};

export default MemberTable; 