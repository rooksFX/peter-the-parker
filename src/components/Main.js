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
          TextField,
          Switch
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
    const [override, setOverride] = useState({
        entry: '',
        exit: '',
        reEntry: '',
    })
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

    const onChangeOverride = e => {
        debugger;
        const value = e.target.value;
        const target = e.target.name;
        const dateParams = value.split('|');
        const year = dateParams[0] || '';
        const month = dateParams[1] || '';
        const date = dateParams[2] || '';
        const hour = dateParams[3] || '';
        const minutes = dateParams[4] || '';
        const toDate = + new Date(year, month, date, hour, minutes);
        const newOverride = {...override};
        window[target] = toDate;
        newOverride[target] = value;
        setOverride(newOverride);
    }

    return (
        <>
            <Container className="main" maxWidth={false}>
                <Card className="parking-lot">
                    <CardContent>
                        {toUnpark.plateNumber &&
                            <div className="modal-container">
                                <UnparkModal toUnpark={ toUnpark }/>
                            </div>
                        }
                        {parkingLots.length > 0 &&
                            <>
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
                                <div className="btn-controls">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="add-column"
                                        onClick={onAddColumn}
                                    >
                                        ADD COLUMN/ENTRY
                                    </Button>
                                </div>

                                <div className="override">
                                    <input type="text" 
                                        className="entry theme-font-color"
                                        placeholder="Override Entry"
                                        name="entry"
                                        value={override.entry.toString()}
                                        onChange={onChangeOverride}
                                    />
                                    <input type="text" 
                                        className="exit theme-font-color"
                                        placeholder="Override Exit"
                                        name="exit"
                                        value={override.exit.toString()}
                                        onChange={onChangeOverride}
                                    />
                                    <input type="text" 
                                        className="reentry theme-font-color"
                                        placeholder="Override Re-entry"
                                        name="reEntry"
                                        value={override.reEntry.toString()}
                                        onChange={onChangeOverride}
                                    />
                                </div>
                            
                            </>
                        }
                    </CardContent>
                </Card>
            </Container>
        </>
    )
}
