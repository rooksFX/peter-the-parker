import React, { useState, useContext } from 'react';
import _ from 'underscore';

import { newYork } from 'license-plate-serial-generator';

import { getMinutesDifference } from '../utils';

import { Context } from '../context/State';
import { ParkingRow } from './ParkingRow';

import { Replay as RandomizeIcon } from '@material-ui/icons';
import { Button } from "@material-ui/core";
import { Alert } from '@material-ui/lab'

export const ParkingColumn = ({ columnIndex, parkingLotsSize, columnParkingLots }) => {
    const { park, parkedCars, deleteColumTemplate, toggleLoading, loading } = useContext(Context);

    const [plateNumber, setPlateNumber] = useState('');
    const [size, setSize] = useState('0')
    const [isDuplicate, setIsDuplicate] = useState(false)
    const [isOccupied, setOccupied] = useState(false)
    

    const onChangePlateNumber = e => {
        const value = e.target.value;
        setPlateNumber(value);
    }

    const onChangeSize = e => {
        const value = e.target.value;
        setSize(value);
    }

    const onPark = () => {
        if (isDuplicate || isOccupied) return;
        if (!plateNumber) return;
        const parkedCar = parkedCars.find(car => car.plateNumber === plateNumber);

        if (!_.isEmpty(parkedCar)) {
            const { timeOut } = parkedCar;
            if (!timeOut) {
                setIsDuplicate(true);
                setTimeout(() => setIsDuplicate(false), 2500);
            }
            else {
                const { id, size: parkedCarSize, timeIn, timeOut } = parkedCar;
                const reEntry = window.reEntry || + new Date();
                const returningWithinOneHour = getMinutesDifference(reEntry, timeOut) < 60;
                const carUpdate = {
                    plateNumber,
                    id,
                    size: returningWithinOneHour? parkedCarSize: size,
                    timeIn: window.reEntry  || + new Date(),
                    ogTimeIn: returningWithinOneHour? parkedCar.ogTimeIn : window.reEntry || + new Date(),
                    timeOut: null,
                }
                toggleLoading(true);
                park({
                    car: carUpdate,
                    wasParked: true,
                    returningWithinOneHour,
                    columnIndex,
                });
                generatePlateNumber();
            }
        }
        else {
            const newCar = {
                plateNumber,
                id: plateNumber,
                size,
                timeIn: window.entry || + new Date(),
                ogTimeIn: window.entry || + new Date(),
                timeOut: null,
            }
            toggleLoading(true);
            park({
                car: newCar,
                wasParked: false,
                returningWithinOneHour: false,
                columnIndex,
            });
            generatePlateNumber();
        }
    }

    const generatePlateNumber = () => {
        const randomPlateNumber = newYork();
        setPlateNumber(randomPlateNumber);
    }

    const columnOccupied = () => {
        const lots = columnParkingLots.flat(2).filter(values => values !== '');
        return !lots.length
    }

    const onDeleteColumn = () => {
        if (isDuplicate || isOccupied) return;
        if (columnOccupied()) {
            toggleLoading(true);
            deleteColumTemplate(columnIndex);
        }
        else {
            setOccupied(true);
            setTimeout(() => setOccupied(false), 2500);
        }
    }

    return (
        <div className="column">
            <div className="rows">
                {columnParkingLots.map((row, index) => (<ParkingRow key={index} columnIndex={columnIndex} rowIndex={index} row={row}/>))}
            </div>
            
            <div className="entry-form">
                {(isDuplicate || isOccupied) &&
                    <Alert className="toaster" elevation={6} variant="filled" severity="error">
                        {isDuplicate? 'Duplicate Plate Number!': 'Column is still occupied!'}
                    </Alert>
                }
                <div className="car-details">
                    <Button
                        className="btn-random"
                        variant="contained"
                        color="secondary"
                        onClick={generatePlateNumber}
                    >
                        <RandomizeIcon/>
                    </Button>
                    <input
                        type="text" 
                        className="plate-number theme-font-color"
                        placeholder="Plate Number"
                        name="plate_number"
                        maxLength={8}
                        value={plateNumber}
                        onChange={onChangePlateNumber}
                    />
                    <select
                        className="size-selector theme-font-color"
                        id="size-selector"
                        value={size}
                        onChange={onChangeSize}
                    >
                        <option value="0">Small</option>
                        <option value="1">Medium</option>
                        <option value="2">Large</option>
                    </select>
                </div>
                <div className="btn-controls">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onPark}
                    >
                        PARK
                    </Button>
                </div>
            </div>
            { (columnIndex > 2
                && columnIndex === parkingLotsSize - 1
                ) &&
                <div className="btn-controls">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onDeleteColumn}
                    >
                        DELETE COLUMN
                    </Button>
                </div>
            }
        </div>
    )
}
