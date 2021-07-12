import React, { useEffect, useContext } from 'react'
import { Context } from '../context/State';
import { ParkingColumn } from './ParkingColumn';

import { Container, Card, CardContent, Button } from "@material-ui/core";

export const Main = () => {
    const { getParkedCars, getParkingLots, addColumTemplate, parkingLots } = useContext(Context);
    useEffect(() => {
        getParkingLots();
        getParkedCars();
    }, [])

    console.log('parkingLots: ', parkingLots);

    return (
        <Container className="main card" maxWidth="lg">
            <Card>
                <CardContent>
                    <div className="columns">
                        {(parkingLots && parkingLots.length) &&
                            parkingLots.map((parkingLot, index) => (<ParkingColumn key={parkingLot.id} columnIndex={parkingLot.id} parkingLot={parkingLot.data} />))
                        }
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addColumTemplate}
                    >
                        ADD COLUMN/ENTRY
                    </Button>
                </CardContent>
            </Card>
        </Container>
    )
}
