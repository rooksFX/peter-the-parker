import React, { useEffect, useContext } from 'react'
import { Context } from '../context/State';

import { Container,
        Card,
        CardContent,
        CardHeader,
        Button,
    } from '@material-ui/core';

export const UnparkModal = ({ toUnpark }) => {
    const { clearToUnpark } = useContext(Context);
    useEffect(() => {
        // setTimeout(() => clearToUnpark(), 5000);
    }, [])
    return (
        <Container className="modal" maxWidth="sm">
            <Card>
                <CardHeader/>
                <CardContent>
                    Plate Number: { toUnpark.plateNumber } <br />
                    No. of hours: { toUnpark.hours } <br />
                    No. of days: { toUnpark.days } <br />
                    Total: { toUnpark.total } <br />
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={clearToUnpark}
                    >
                        OK
                    </Button>
                </CardContent>
            </Card>`
        </Container>
    )
}
