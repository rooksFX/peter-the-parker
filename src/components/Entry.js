import React from 'react'

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

export const Entry = () => {
    const classes = useStyles();
    return (
        <div className="">
            <div className="entry-form">
                <TextField 
                    className="plate-number"
                    id="outlined-basic"
                    label="Plate Number"
                    name="plate_number"
                    variant="outlined"
                    // value={plateNumber}
                    // onChange={onChangePlateNumber}
                />
                <FormControl className={classes.formControl}>
                    <InputLabel id="label-size">Size</InputLabel>
                    <Select
                        labelId="label-size"
                        id="size-selector"
                        // value={size}
                        // onChange={onChangeSize}
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
                        // onClick={generatePlateNumber}
                    >
                        <RandomizeIcon/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        // onClick={onPark}
                    >
                        PARK
                    </Button>
                </div>
            </div>
        </div>
    )
}
