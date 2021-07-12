import React from 'react'
import { Lot } from './Lot'

export const Group = ({ group, groupIndex, columnIndex, rowIndex }) => {
    return (
        <div className="group">
            {group.map((lot, index) => <Lot key={index} lotIndex={index} groupIndex={groupIndex} columnIndex={columnIndex} rowIndex={rowIndex} lot={lot}/>)}
        </div>
    )
}
