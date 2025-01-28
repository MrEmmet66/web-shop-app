import React from 'react';
import { Space, Input, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface SpecificationsEditorProps {
    specifications: { name: string, value: string }[];
    onSpecificationChange: (index: number, field: string, value: string) => void;
    onSpecificationAdd: () => void;
    onSpecificationRemove: (index: number) => void;
}

function SpecificationsEditor({ specifications, onSpecificationChange, onSpecificationRemove, onSpecificationAdd }: SpecificationsEditorProps) {


    return (
        <div>
            {specifications.map((char, index) => (
                <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Input placeholder="Name" value={char.name} onChange={(e) => onSpecificationChange(index, 'name', e.target.value)} />
                    <Input placeholder="Value" value={char.value} onChange={(e) => onSpecificationChange(index, 'value', e.target.value)} />
                    <CloseOutlined onClick={() => onSpecificationRemove(index)} />
                </Space>
            ))}
            <Button type="dashed" onClick={onSpecificationAdd}>
                Add Specification
            </Button>
        </div>
    );
}

export default SpecificationsEditor;