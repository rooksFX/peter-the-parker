import React from 'react'
import { Group } from './Group';

export const Column = ({ rowIndex, columnIndex, column }) => {
    return (
        <div className="columns">
            {column.map((group, index) => (<Group key={index} groupIndex={index} columnIndex={columnIndex} rowIndex={rowIndex} group={group}/>))}
        </div>
    )
}
