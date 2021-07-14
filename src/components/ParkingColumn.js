import React, { useState, useContext } from 'react';
import _ from 'underscore';

import { newYork } from 'license-plate-serial-generator';

import { Context } from '../context/State';
import { ParkingRow } from './ParkingRow';

import { makeStyles } from '@material-ui/core/styles';
import { Replay as RandomizeIcon } from '@material-ui/icons';
import { 
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const ParkingColumn = ({ columnIndex, parkingLot }) => {
    const classes = useStyles();
    const { park, parkedCars, toggleLoading, loading } = useContext(Context);
    const [plateNumber, setPlateNumber] = useState('');
    const [size, setSize] = useState('0')

    const onChangePlateNumber = e => {
        const value = e.target.value;
        setPlateNumber(value);
    }

    const onChangeSize = e => {
        const value = e.target.value;
        setSize(value);
    }

    const onPark = () => {
        debugger;
        if (!plateNumber) return;
        const parkedCar = parkedCars.find(car => car.plateNumber === plateNumber);

        if (!_.isEmpty(parkedCar)) {
            const { timeOut } = parkedCar;
            if (!timeOut) {
                // Still parked
            }
            else {
                const { id, size: parkedCarSize, timeIn } = parkedCar;
                const returningWithinOneHour = isReturningWithinOneHour(parkedCar.timeOut);
                const carUpdate = {
                    plateNumber,
                    id,
                    size: returningWithinOneHour? parkedCarSize: size,
                    timeIn: returningWithinOneHour? timeIn: + new Date(),
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
                id: parkedCars.length + 1,
                size,
                timeIn: + new Date(),
                timeOut: null,
            }
            debugger;
            toggleLoading(true);
            park({
                car: newCar,
                wasParked: false,
                returningWithinOneHour: false,
                columnIndex,
            });
            generatePlateNumber();
        }

        // // If car has already been parked and hasn't left yet
        // if (parkedCar && !parkedCar.timeOut) {
        //     alert('Duplicate Platenumber!');
        // }
        // // Returning
        // else if (parkedCar && parkedCar.timeOut) {
        //     // returning within one hour
        //     const returningWithinOneHour = isReturningWithinOneHour(parkedCar.timeOut);
        //     toggleLoading(true);
        //     const carUpdate = {
        //         plateNumber,
        //         id: parkedCar.id,
        //         size: parkedCar.size,
        //         columnIndex,
        //         timeIn: parkedCar.timeIn,
        //         timeOut: parkedCar.timeOut,
        //         returningWithinOneHour
                
        //     }
        //     park(carUpdate);
        // }
        // else {

        //     const timeIn = + new Date();
        //     const returning = parkedCar? isReturningWithinOneHour(parkedCar.timeOut) : false;
        //     park({ 
        //         plateNumber,
        //         size: returning? parkedCar.size : size,
        //         columnIndex,
        //         timeIn: returning? parkedCar.timeIn : timeIn,
        //         timeOut: returning? parkedCar.timeOut: null 
        //     });
        //     generatePlateNumber();
        // }
    }

    const isReturningWithinOneHour = (exit) => {
        debugger;
        const current = window.overrideDate || + new Date();
        const res = Math.abs(exit - current) / 1000;
        const minutes = Math.floor(res / 60) % 60;    
        return minutes <= 60;
    }

    const generatePlateNumber = () => {
        const randomPlateNumber = newYork();
        setPlateNumber(randomPlateNumber);
    }

    return (
        <div className="column">
            <div className="rows">
                {parkingLot.map((row, index) => (<ParkingRow key={index} columnIndex={columnIndex} rowIndex={index} row={row}/>))}
            </div>
            
            <div className="entry-form">
                <TextField 
                    className="plate-number"
                    id="outlined-basic"
                    label="Plate Number"
                    name="plate_number"
                    variant="outlined"
                    value={plateNumber}
                    onChange={onChangePlateNumber}
                />
                <FormControl className={classes.formControl}>
                    <InputLabel id="label-size">Size</InputLabel>
                    <Select
                        labelId="label-size"
                        id="size-selector"
                        value={size}
                        onChange={onChangeSize}
                    >
                        <MenuItem value="0">Small</MenuItem>
                        <MenuItem value="1">Medium</MenuItem>
                        <MenuItem value="2">Large</MenuItem>
                    </Select>
                </FormControl>
                <div className="btn-controls">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={generatePlateNumber}
                    >
                        <RandomizeIcon/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onPark}
                    >
                        PARK
                    </Button>
                </div>
            </div>
        </div>
    )
}
