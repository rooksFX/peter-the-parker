import React, { useContext } from 'react'
import { Context } from '../context/State';

import { Container,
        Card,
        CardContent,
        CardHeader,
        Button,
    } from '@material-ui/core';

export const ErrorModal = ({ error }) => {
    const { clearError } = useContext(Context);

    const dismissError = () => {
        clearError();
    }

    return (
        <Container className="modal error" maxWidth="sm">
            <Card>
                <CardHeader/>
                <CardContent>
                    <h2 className="error-color">{error}</h2>
                    <div className="btn-controls">
                        <Button 
                            variant="contained"
                            color="primary"
                            onClick={dismissError}
                        >
                            OK
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Container>
    )
}
