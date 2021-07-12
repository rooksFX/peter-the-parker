import React from 'react'
import { Group } from './Group'

export const ParkingRow = ({ row, columnIndex, rowIndex }) => {
    return (
        <div className="row">
            {row.map((group, index) => (<Group key={index} groupIndex={index} columnIndex={columnIndex} rowIndex={rowIndex} group={group}/>))}
        </div>
    )
}
