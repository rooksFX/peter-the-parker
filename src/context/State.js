import React, { createContext, useReducer } from 'react';
import Reducer from './Reducer';
import axios from 'axios';

import { mapVehicle, calculatTotal } from '../utils';

const initialState = {
    parkingLots: [],
    parkedCars: [],
    cars: [],
    error: null,
    loading: true
}

const createColumnTemplate = id => {
    return {
        id,
        data: 
        [
            [ [ "", "", "" ], [ "", "", "" ] ],
            [ [ "", "", "" ], [ "", "", "" ] ],
            [ [ "", "", "" ], [ "", "", "" ] ],
            [ [ "", "", "" ], [ "", "", "" ] ]
        ]
    }
}

const domain = 'http://localhost:3001';

export const Context = createContext(initialState);

export const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    const getParkedCars = async () => {
        try {
            const res = await axios.get(`${domain}/parked-cars`);
            dispatch({
               type: 'GET_PARKED_CARS',
               payload: res.data
            })
        } catch (error) {
            
        }
    }

    const getParkingLots = async () => {
        try {
            const res = await axios.get(`${domain}/parking-lots`);
            dispatch({
               type: 'GET_PARKING_LOTS',
               payload: res.data
            })
        } catch (error) {
            
        }
    }

    const addColumTemplate = async () => {
        try {
            debugger;
            const newColumn = createColumnTemplate(state.parkingLots.length);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            await axios.post(`${domain}/parking-lots`, newColumn, config);
            dispatch({
                type: 'ADD_COLUMN',
                payload: newColumn
            })
        } catch (error) {
            dispatch({
               type: 'ERROR',
               payload: null
            })
        }

    }

    const park = async ( payload ) => {
        debugger;
        const { plateNumber, size, timeIn} = payload;
        const plateNumbers = state.parkedCars.map(({ plateNumber }) => plateNumber);
        const alreadyParked = plateNumbers.includes(plateNumber);
        let parkingLots;

        const car = {
            plateNumber,
            size,
            timeIn
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json', } }
            // Update Parking Lots
            debugger;
            if (!alreadyParked) {
                const { revertedLots: parkingLots, currentCol: index } = await mapVehicle(state.parkingLots, payload);
                const updatedCol = parkingLots[index];
                await axios.put(`${domain}/parking-lots/${index}`, updatedCol, config);
            }
            // Update Cars
            await axios.post(`${domain}/parked-cars/`, car, config);
            dispatch({
               type: 'PARK',
               payload: { 
                   ...(!alreadyParked && { parkingLots }), 
                   car, 
                   alreadyParked }
            })
        } catch (error) {
            dispatch({
               type: 'ERROR',
               payload: null
            })
        }
    }

    const unpark = async (car, lotSize) => {
        debugger;
        const total = calculatTotal(car, lotSize);
        console.log('total: ', total);
        try {
            
        } catch (error) {
            
        }
    }

    const getCarDetails = async () => {

    }

    return (
        <Context.Provider
            value={{
                parkingLots: state.parkingLots,
                parkedCars: state.parkedCars,
                error: state.error,
                loading: state.loading,
                getParkedCars,
                getParkingLots,
                addColumTemplate,
                park,
                unpark
        }}>
            { children }
        </Context.Provider>
    )   
}
