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

            const hehe = state.parkingLots.filter(column => column.id !== columnToUpdate.id);
            hehe.unshift(columnToUpdate);

            const test = state.parkedCars.filter(parkedCar => parkedCar.id !== car.id);
            test.unshift(car);

            debugger;

            return {
                ...state,
                parkingLots: hehe.sort((a, b) => a.id - b.id),
                parkedCars: test.sort((a, b) => a.id - b.id),
                loading: false
            }
        case 'UNPARK':
            const { unparkedCar, targetColumn, toUnpark } = action.payload;
            debugger;
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
        
        case 'ADD_ENTRY':
        
            break;
        case 'DELETE_ENTRY':

        case 'TOGGLE_LOADING':
            // console.log('TOGGLE_LOADING: ', action.payload);
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
    
        default:
            break;
    }
}