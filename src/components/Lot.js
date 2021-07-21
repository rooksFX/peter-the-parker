import React, { useContext } from 'react'
import { Context } from '../context/State';

export const Lot = ({ lot, lotIndex, groupIndex, columnIndex, rowIndex }) => {
    const { parkingLots, parkedCars, unpark, toggleLoading, loading } = useContext(Context);
    const car = parkedCars.find(car => {
        return car.plateNumber === lot;
    }) || {};
    const { size } = car;
    const sizeLabel = !size? '': size === '0'? 's': size === '1'? 'm': 'l';

    const submitForUnparking = () => {
        debugger;
        if (!lot) return;
        const columnToUpdate = parkingLots[columnIndex].data;
        columnToUpdate[rowIndex][groupIndex][lotIndex] = '';
        toggleLoading(true);
        unpark(car, lotIndex, [columnIndex, rowIndex, groupIndex, lotIndex]);
    }

    return (
        <div className={`lot lot-${lotIndex}`} onClick={submitForUnparking}>
            <div className="lot-header">
                <div className={`size-badge ${size? 'occupied': ''}`}>
                    {size && sizeLabel}
                </div>
                {columnIndex}{rowIndex}{groupIndex}{lotIndex}
            </div>
            {lot &&
                <>
                    <div className="plate-number-container">
                        <div className="plate-number">
                            <h6> - Registered - </h6>
                            <h4>{lot}</h4>
                            <h6> - Coruscant - </h6>
                        </div>
                    </div>
                    <div className="parking-details">
                        <div className="parking-details-row">
                            <div className="label">
                                <h5>
                                    Time In:
                                </h5>
                            </div>
                            <div className="value">
                                <h5>
                                    {new Date(car.ogTimeIn).toLocaleTimeString()}  
                                </h5>
                            </div>
                        </div>
                        <div className="parking-details-row">
                            <div className="label">
                                <h5>
                                    Date:
                                </h5>
                            </div>
                            <div className="value">
                                <h5>
                                    {new Date(car.ogTimeIn).toDateString()}
                                </h5>
                            </div>
                        </div>

                    </div>
                </>
            }
        </div>
    )
}
