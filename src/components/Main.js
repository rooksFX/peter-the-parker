import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../context/State';
import { ParkingColumn } from './ParkingColumn';
import { UnparkModal } from './UnparkModal';
import { ErrorModal } from './ErrorModal';
import { Container, 
          Card, 
          CardContent, 
          Button, 
          CircularProgress, 
          Backdrop
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
    });
    const { getParkedCars, getParkingLots, addColumTemplate, toggleLoading, loading, error, toUnpark, parkingLots } = useContext(Context);

    useEffect(() => {
        getParkingLots();
        getParkedCars();
    }, [])

    const onAddColumn = () => {
        toggleLoading(true);
        addColumTemplate();
    }

    const onChangeOverride = e => {
        const value = e.target.value;
        const target = e.target.name;
        let year, month, date, hour, minutes, toDate;
        if (value) {
            const dateParams = value.split('|');
            year = dateParams[0] || '';
            month = dateParams[1] || '';
            date = dateParams[2] || '';
            hour = dateParams[3] || '';
            minutes = dateParams[4] || '';
            toDate = + new Date(year, month, date, hour, minutes);
        }
        const newOverride = {...override};
        window[target] = toDate || '';
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
                        {error &&
                            <div className="modal-container">
                                <ErrorModal error={error}/>
                            </div>
                        }
                        {loading &&
                        <Backdrop className={classes.backdrop} open={loading}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        }
                        {parkingLots.length > 0 &&
                            <>
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
