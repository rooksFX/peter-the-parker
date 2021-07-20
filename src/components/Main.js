import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../context/State';
import { ParkingColumn } from './ParkingColumn';
import { Entry } from './Entry';
import { Row } from './Row';
import { UnparkModal } from './UnparkModal';
import { Container, 
          Card, 
          CardContent, 
          Button, 
          CircularProgress, 
          Backdrop, 
          TextField
        } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export const Main = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [entry, setEntry] = useState('');
    const [exit, setExit] = useState('');
    const [reentry, setReentry] = useState('');
    const { getParkedCars, getParkingLots, addColumTemplate, toggleLoading, loading, toUnpark, parkingLots } = useContext(Context);
    useEffect(() => {
        toggleLoading(true);
        getParkingLots();
        getParkedCars();
    }, [])

    const onAddColumn = () => {
        toggleLoading(true);
        addColumTemplate();
    }

    const onChangeEntry = e => {
        const value = e.target.value;
        window.entry = value;
        setEntry(value);
    }

    const onChangeExit = e => {
        const value = e.target.value;
        window.exit = value;
        setExit(value);
    }

    const onChangeReentry = e => {
        const value = e.target.value;
        window.reEntry = value;
        setReentry(value);
    }

    return (
        <>
            {toUnpark.plateNumber &&
                <div className="modal-container">
                    <UnparkModal toUnpark={ toUnpark }/>
                </div>
            }
                {/* <Modal
                    open={true}
                >
                    <div className={classes.paper}>
                        Modal Test
                    </div>
                </Modal> */}
            {parkingLots.length > 0 &&
                <Container className="main card" maxWidth={false}>
                    <Card>
                        <CardContent>
                            {loading &&
                            <Backdrop className={classes.backdrop} open={loading}>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                            }
                            <div className="columns">
                                {(parkingLots && parkingLots.length) &&
                                    parkingLots.map((columnParkingLots, index) => (<ParkingColumn key={columnParkingLots.id} columnIndex={columnParkingLots.id} parkingLotsSize={parkingLots.length} columnParkingLots={columnParkingLots.data} />))
                                }
                            </div>
                            {/* <div className="rows">
                                {(parkingLots && parkingLots.length) &&
                                    parkingLots.map((row, index) => (<Row key={row.id} rowIndex={row.id} row={row.data} />))
                                }
                            </div>
                            <div className="columns">
                                {(parkingLots && parkingLots.length) &&
                                    parkingLots[0].data.map((column, index) => (<Entry key={column.id} columnIndex={column.id} column={column.data} />))
                                }
                            </div> */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onAddColumn}
                            >
                                ADD COLUMN/ENTRY
                            </Button>

                            {/* <div className="override">
                                <TextField 
                                    className="plate-number"
                                    id="outlined-basic"
                                    label="Override Entry"
                                    name="plate_number"
                                    variant="outlined"
                                    value={entry}
                                    onChange={onChangeEntry}
                                />
                                <TextField 
                                    className="plate-number"
                                    id="outlined-basic"
                                    label="Override Exit"
                                    name="plate_number"
                                    variant="outlined"
                                    value={exit}
                                    onChange={onChangeExit}
                                />
                                <TextField 
                                    className="plate-number"
                                    id="outlined-basic"
                                    label="Override Reentry"
                                    name="plate_number"
                                    variant="outlined"
                                    value={reentry}
                                    onChange={onChangeReentry}
                                />
                            </div> */}
                        </CardContent>
                    </Card>
                </Container>
            }
        </>
    )
}
