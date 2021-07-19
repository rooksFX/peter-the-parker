import React, { useState, useContext } from 'react';
import _ from 'underscore';

import { newYork } from 'license-plate-serial-generator';

import { getMinutesDifference } from '../utils';

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

export const ParkingColumn = ({ columnIndex, columnParkingLots }) => {
    // console.log('columnParkingLots: ', columnParkingLots);
    const classes = useStyles();
    const { park, parkedCars, deleteColumTemplate, toggleLoading, loading } = useContext(Context);
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
        // console.log('onPark: ', columnParkingLots);
        // debugger;
        if (!plateNumber) return;
        const parkedCar = parkedCars.find(car => car.plateNumber === plateNumber);

        if (!_.isEmpty(parkedCar)) {
            const { timeOut } = parkedCar;
            if (!timeOut) {
                // Still parked
            }
            else {
                const { id, size: parkedCarSize, timeIn, timeOut } = parkedCar;
                // const returningWithinOneHour = isReturningWithinOneHour(parkedCar.timeOut);
                const returningWithinOneHour = getMinutesDifference(+ new Date(), timeOut) < 60;
                const carUpdate = {
                    plateNumber,
                    id,
                    size: returningWithinOneHour? parkedCarSize: size,
                    // timeIn: returningWithinOneHour? window.reEntry || timeIn : + new Date(),
                    timeIn: + new Date(),
                    ogTimeIn: returningWithinOneHour? parkedCar.ogTimeIn : + new Date(),
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
                timeIn: window.reEntry || + new Date(),
                ogTimeIn: window.reEntry || + new Date(),
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
        // debugger;
        const randomPlateNumber = newYork();
        setPlateNumber(randomPlateNumber);
    }

    const onDeleteColumn = () => {
        debugger;
        // console.log('onDeleteColumn: ', columnParkingLots);
        const lots = columnParkingLots.flat(2).filter(values => values !== '');
        if (!lots.length) {
            toggleLoading(true);
            deleteColumTemplate(columnIndex);
        }
    }

    return (
        <div className="column">
            <div className="rows">
                {columnParkingLots.map((row, index) => (<ParkingRow key={index} columnIndex={columnIndex} rowIndex={index} row={row}/>))}
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
                { columnIndex > 2 &&
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
        </div>
    )
}
