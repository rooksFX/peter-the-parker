import React, { useContext } from 'react'
import { Context } from '../context/State';

export const Lot = ({ lot, lotIndex, groupIndex, columnIndex, rowIndex }) => {
    const { parkingLots, parkedCars, unpark, toggleLoading, loading } = useContext(Context);
    const car = parkedCars.find(car => {
        return car.plateNumber === lot;
    }) || {};
    const { size } = car;
    const sizeLabel = !size? '': size === '0'? 's': size === '1'? 'm': 'l';

    if (lot === 'GBJ-7290') debugger;

    const submitForUnparking = () => {
        if (!lot) return;
        const columnToUpdate = parkingLots[columnIndex].data;
        columnToUpdate[rowIndex][groupIndex][lotIndex] = '';
        toggleLoading(true);
        unpark(car, lotIndex, [columnIndex, rowIndex, groupIndex, lotIndex]);
    }

    return (
        <div className={`lot lot-${lotIndex}`} onClick={submitForUnparking}>
            {rowIndex} | {columnIndex} | {groupIndex} | {lotIndex}
            <div className={`size-badge ${size? 'occupied': ''}`}>
                {size && sizeLabel}
            </div>
            {lot &&
                <div className="plate-number-container">
                    <div className="plate-number">
                        <h6> - Registered - </h6>
                        <h4>{lot}</h4>
                        <h6> - Coruscant - </h6>
                    </div>
                </div>
            }
        </div>
    )
}
