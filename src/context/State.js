import React, { createContext, useReducer } from 'react';
import Reducer from './Reducer';
import axios from 'axios';

import { mapVehicle, calculateTotal } from '../utils';

const initialState = {
    parkingLots: [],
    parkedCars: [],
    cars: [],
    toUnpark: {},
    error: null,
    loading: true,
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

    const deleteColumTemplate = async columnIndex => {
        try {
            await axios.delete(`${domain}/parking-lots/${columnIndex}`);
            dispatch({
                type: 'DELETE_COLUMN',
                payload: columnIndex
            })
        } catch (error) {
            dispatch({
               type: 'ERROR',
               payload: null
            })
        }
    }

    const park = async ( payload ) => {
        // debugger;
        const { car, wasParked, returningWithinOneHour, columnIndex } = payload;
        const parkedCar = state.parkedCars.find(car => car.plateNumber === car.plateNumber);
        try {
            const config = { headers: { 'Content-Type': 'application/json', } };
            const { columnToUpdate, currentCol } = await mapVehicle(state.parkingLots, car, columnIndex);
            
            if (columnToUpdate) {
                await axios.put(`${domain}/parking-lots/${currentCol}`, columnToUpdate, config);
    
                if (wasParked) {
                    await axios.put(`${domain}/parked-cars/${car.id}`, car, config);
                }
                else {
                    await axios.post(`${domain}/parked-cars`, car, config);
                }
    
                dispatch({
                    type: 'PARK',
                    payload: { 
                        columnToUpdate,
                        car,
                    }
                 })
            }
            else {
                dispatch({
                    type: 'TOGGLE_LOADING',
                    payload: false
                })
            }

        } catch (error) {
            console.error(error);
            dispatch({
               type: 'ERROR',
               payload: null
            })
        }
    }

    const unpark = async (car, lotSize, target) => {
        debugger;
        const { entryString, exitString,  total, hours, days, hourlyRate } = calculateTotal(car, lotSize);
        car.timeOut = + new Date();
        const targetColumn = state.parkingLots[target[0]];
        targetColumn.data[target[1]][target[2]][target[3]] = '';
        try {
            const config = { headers: { 'Content-Type': 'application/json', } }
            
            await axios.put(`${domain}/parking-lots/${target[0]}`, targetColumn, config);
            await axios.patch(`${domain}/parked-cars/${car.id}`, car, config);

            const toUnpark = {
                plateNumber: car.plateNumber,
                entryString, 
                exitString,
                total,
                hours,
                days,
                hourlyRate
            }

            dispatch({
               type: 'UNPARK',
               payload: { 
                    targetColumn,
                    unparkedCar: car,
                    toUnpark
               }
            })
        } catch (error) {
            
        }
    }

    const getCarDetails = async () => {

    }

    const clearToUnpark = () => {
        dispatch({
            type: 'CLEAR_TO_UNPARK',
            payload: {}
        })
    }

    const toggleLoading = toggle => {
        dispatch({
           type: 'TOGGLE_LOADING',
           payload: { 
                toggle
           }
        })
    }

    return (
        <Context.Provider
            value={{
                parkingLots: state.parkingLots,
                parkedCars: state.parkedCars,
                error: state.error,
                loading: state.loading,
                toUnpark: state.toUnpark,
                getParkedCars,
                getParkingLots,
                addColumTemplate,
                deleteColumTemplate,
                toggleLoading,
                park,
                unpark,
                clearToUnpark,
        }}>
            { children }
        </Context.Provider>
    )   
}
