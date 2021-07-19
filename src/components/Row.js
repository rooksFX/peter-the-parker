import React from 'react'
import { Column } from './Column';

export const Row = ({ rowIndex, row }) => {
    return (
        <div className="row">
            {row.map((column, index) => (<Column key={index} rowIndex={rowIndex} columnIndex={index} column={column}/>))}
        </div>
    )
}
