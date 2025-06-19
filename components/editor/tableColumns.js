import { Form, Radio, Button, Select } from 'antd';
import { MEMBER_TYPES, getTalentMap, getSkillMap, getSkillOptions, getTalentOptions } from './constants';
// 创建表格列配置
export const createTableColumns = (
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
) => {
  const talentMap = getTalentMap(locale);
  const skillMap = getSkillMap(locale);

  const baseColumns = [
    {
      title: t.table.name,
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
      title: t.attributes.reputation,
      dataIndex: 'reputation',
      key: 'reputation',
      editable: true,
    }
  ];

  // 为家族成员和嫁娶成员添加额外列
  if (memberType === MEMBER_TYPES.FAMILY || memberType === MEMBER_TYPES.SPOUSE) {
    baseColumns.push(
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
        title: t.attributes.health,
        dataIndex: 'health',
        key: 'health',
        editable: true,
      },
      {
        title: t.attributes.talent,
        dataIndex: 'talent',
        key: 'talent',
        render: (text, record) => {
          const talentOptions = getTalentOptions(locale);
          
          return isEditing(record) ? (
            <Form.Item name="talent" style={{ margin: 0 }}>
              <Select 
                value={text} 
                style={{ minWidth: 100 }}
                getPopupContainer={trigger => trigger.parentElement}
                dropdownMatchSelectWidth={false}
                placeholder={t.table.selectTalent}
              >
                {talentOptions.map(option => (
                  <Select.Option key={option.key} value={option.key}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            talentMap[text] || text
          );
        }
      },
      {
        title: t.table.talentValue,
        dataIndex: 'talent_num',
        key: 'talent_num',
        editable: true,
      },
      {
        title: t.attributes.skill,
        dataIndex: 'skill',
        key: 'skill',
        render: (text, record) => {
          const skillOptions = getSkillOptions(locale);
          
          return isEditing(record) ? (
            <Form.Item name="skill" style={{ margin: 0 }}>
              <Select 
                value={text} 
                style={{ minWidth: 100 }}
                getPopupContainer={trigger => trigger.parentElement}
                dropdownMatchSelectWidth={false}
                placeholder={t.table.selectSkill}
              >
                {skillOptions.map(option => (
                  <Select.Option key={option.key} value={option.key}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
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
      }
    );
  }

  // 为门客添加薪酬列
  if (memberType === MEMBER_TYPES.GUEST) {
    baseColumns.push({
      title: t.table.monthlySalary,
      dataIndex: 'payment',
      key: 'payment',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return !editable && `${locale === 'zh' ? '￥' : '$'}${text}`;
      }
    });
  }

  // 添加操作列
  baseColumns.push({
    title: t.table.actions,
    dataIndex: 'operation',
    render: (_, record) => {
      const editable = isEditing(record);
      // 检查是否处于异常状态（仅适用于家族成员）
      const isInAbnormalState = memberType === MEMBER_TYPES.FAMILY && 
        record.punishmentStatus && ['1', '4', '5', '6', '7', '8', '9'].includes(record.punishmentStatus);

      return editable ? (
        <span>
          <Button
            onClick={() => save(record.id, memberType)}
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
        <span>
          <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small" style={{ marginRight: 8 }}>
            {t.edit}
          </Button>
          {isInAbnormalState && (
            <Button 
              type="primary"
              size="small" 
              onClick={() => handleRemovePunishment(record, memberType)}
              disabled={editingKey !== ''}
              style={{ marginRight: 8 }}
            >
              {t.table.removePunishment}
            </Button>
          )}
          {memberType !== MEMBER_TYPES.GUEST && (
            <Button 
              size="small" 
              onClick={() => maxSingleMemberAttributes(record, memberType)}
              disabled={editingKey !== ''}
              style={{ marginRight: 8 }}
            >
              {t.table.maxAttributes}
            </Button>
          )}
          {(memberType === MEMBER_TYPES.FAMILY || memberType === MEMBER_TYPES.SPOUSE) && 
           record.age >= 18 && record.age <= 30 && record.gender === '0' && (
            <Button 
              danger 
              size="small" 
              onClick={() => handlePregnancy(record, memberType)}
              disabled={editingKey !== ''}
            >
              {t.table.immediatePregnancy}
            </Button>
          )}
        </span>
      );
    },
  });

  return baseColumns;
};

// 创建合并后的列配置
export const createMergedColumns = (columns, isEditing) => {
  return columns.map((col) => {
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
}; 