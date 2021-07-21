import React, { useContext } from 'react'
import { Context } from '../context/State';

import { Container,
        Card,
        CardContent,
        CardHeader,
        Button,
    } from '@material-ui/core';

export const UnparkModal = ({ toUnpark }) => {
    const { clearToUnpark } = useContext(Context);

    return (
        <Container className="modal" maxWidth="sm">
            <Card>
                <CardHeader/>
                <CardContent>
                    <div className="unpark">
                        <div className="plate-number-container">
                            <div className="plate-number">
                                <h6>Registered</h6>
                                <h4>{ toUnpark.plateNumber }</h4>
                                <h6>Coruscant</h6>
                            </div>
                        </div>
                        <div className="details theme-font-color">
                            <div className="details-row">
                                <h4>Parking Details</h4>
                            </div>
                            <div className="details-row">
                                <div className="details-label">
                                    Time in: 
                                </div>
                                <div className="details-value">
                                    <h4>
                                        { toUnpark.entryString } 
                                    </h4>
                                </div>
                            </div>
                            <div className="details-row">
                                <div className="details-label">
                                    Time out: 
                                </div>
                                <div className="details-value">
                                    <h4>
                                        { toUnpark.exitString }
                                    </h4>
                                </div>
                            </div>
                            <div className="details-row">
                                <div className="details-label">
                                    No. of hours:
                                </div>
                                <div className="details-value">
                                    <h4>
                                        { toUnpark.hours }
                                    </h4>
                                </div>
                            </div>
                            {toUnpark.days > 0 &&
                                <div className="details-row">
                                    <div className="details-label">
                                        No. of days:
                                    </div>
                                    <div className="details-value">
                                        <h4>
                                            { toUnpark.days }
                                        </h4>
                                    </div>
                                </div>
                            }
                            <div className="details-row">
                                <div className="details-label">
                                    Hourly rate:
                                </div>
                                <div className="details-value">
                                    <h4>
                                        P{ toUnpark.hourlyRate }
                                    </h4>
                                </div>
                            </div>
                            <div className="details-row total">
                                <div className="details-label">
                                    Total:
                                </div>
                                <div className="details-value">
                                    <h4>
                                        P{ toUnpark.total }
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="btn-controls">
                        <Button 
                            variant="contained"
                            color="primary"
                            onClick={clearToUnpark}
                        >
                            OK
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Container>
    )
}
