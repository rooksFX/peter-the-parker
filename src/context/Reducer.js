export default (state, action) => {
    switch (action.type) {
        case 'GET_PARKED_CARS':
            return {
                ...state,
                parkedCars: action.payload,
                loading: false
            }
        case 'GET_PARKING_LOTS':
            return {
                ...state,
                parkingLots: action.payload,
                loading: false
            }
        case 'ADD_COLUMN':
            return {
                ...state,
                parkingLots: [action.payload, ...state.parkingLots].sort((a, b) => a.id - b.id),
                loading: false
            }
        case 'DELETE_COLUMN':
            return {
                ...state,
                parkingLots: state.parkingLots.filter(column => column.id !== action.payload),
                loading: false
            }
        case 'PARK':
            const { columnToUpdate, car } = action.payload

            const updateParkingLots = state.parkingLots.filter(column => column.id !== columnToUpdate.id);
            updateParkingLots.unshift(columnToUpdate);

            const updateParkedCars = state.parkedCars.filter(parkedCar => parkedCar.id !== car.id);
            updateParkedCars.unshift(car);
            return {
                ...state,
                parkingLots: updateParkingLots.sort((a, b) => a.id - b.id),
                parkedCars: updateParkedCars.sort((a, b) => a.id - b.id),
                loading: false
            }
        case 'UNPARK':
            const { unparkedCar, targetColumn, toUnpark } = action.payload;
            const updatedParkingLots = state.parkingLots.filter(column => column.id !== targetColumn.id);
            updatedParkingLots.unshift(targetColumn);

            const updatedParkedCars = state.parkedCars.filter(car => car.id !== unparkedCar.id);
            updatedParkedCars.unshift(unparkedCar);
            return {
                ...state,
                parkingLots: updatedParkingLots.sort((a, b) => a.id - b.id),
                parkedCars: updatedParkedCars.sort((a, b) => a.id - b.id),
                loading: false,
                toUnpark,
            }

        case 'TOGGLE_LOADING':
            return {
                ...state,
                loading: action.payload
            }

        case 'CLEAR_TO_UNPARK':
            return {
                ...state,
                toUnpark: action.payload
            }
        
        case 'ERROR':
            return {
                ...state,
                loading: false,
            }

        case 'SET_ERROR': 
        return {
            ...state,
            loading: false,
            error: action.payload
        }

        case 'CLEAR_ERROR': 
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    
        default:
            break;
    }
}