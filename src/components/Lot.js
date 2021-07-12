import React, { useContext } from 'react'
import { Context } from '../context/State';

export const Lot = ({ lot, lotIndex, groupIndex, columnIndex, rowIndex }) => {
    const { parkingLots, parkedCars, unpark } = useContext(Context);
    const car = parkedCars.find(car => {
        if (lot === 'GBJ-7290') debugger;
        return car.plateNumber === lot;
    }) || {};
    const { size } = car;
    const sizeLabel = !size? '': size === '0'? 's': size === '1'? 'm': 'l';

    if (lot === 'GBJ-7290') debugger;

    const submitForUnparking = () => {
        const columnToUpdate = parkingLots[columnIndex].data;
        debugger;
        console.log('Before unpark: ', columnToUpdate[rowIndex][groupIndex][lotIndex]);
        columnToUpdate[rowIndex][groupIndex][lotIndex] = '';
        console.log('After unpark: ', columnToUpdate[rowIndex][groupIndex][lotIndex]);
        unpark(car, lotIndex);
    }

    return (
        <div className={`lot lot-${lotIndex}`} onClick={submitForUnparking}>
            <div className={`size-badge ${size? 'occupied': ''}`}>
                {size && sizeLabel}
            </div>
            {lot}
        </div>
    )
}
