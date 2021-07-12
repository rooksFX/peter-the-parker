import React, { useState, useContext } from 'react';

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
    const { park, parkedCars } = useContext(Context);
    const [plateNumber, setPlateNumber] = useState('');
    const [size, setSize] = useState('0')

    console.log('parkedCars: ', parkedCars);

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
        const plateNumbers = parkedCars.map(({ plateNumber }) => plateNumber);
        const parkedCar = parkedCars.find(car => car.plateNumber === plateNumber);
        if (parkedCar && !parkedCar.timeOut) {
            alert('Duplicate Platenumber!');
        }
        else {
            const timeIn = + new Date();
            const nagbabalik = isBeyondOneHour(parkedCar.timeOut);
            park({ 
                plateNumber,
                size,
                columnIndex,
                timeIn: nagbabalik? parkedCar.timeIn : timeIn,
                timeOut: null });
            generatePlateNumber();
        }
    }

    const isBeyondOneHour = (exit) => {
        debugger;
        const current = window.overrideDate || + new Date();
        const res = Math.abs(exit - current) / 1000;
        const minutes = Math.floor(res / 60) % 60;    
        return minutes >= 60;
    }

    const generatePlateNumber = () => {
        const randomPlateNumber = newYork();
        setPlateNumber(randomPlateNumber);
    }

    return (
        <div className="column">
            <div className="rows">
                {parkingLot.map((row, index) => (<ParkingRow key={index} columnIndex={columnIndex} rowIndex={columnIndex} row={row}/>))}
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
