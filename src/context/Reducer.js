export default (state, action) => {
    switch (action.type) {
        case 'GET_PARKED_CARS':
            return {
                ...state,
                parkedCars: action.payload
            }
        case 'GET_PARKING_LOTS':
            return {
                ...state,
                parkingLots: action.payload
            }
        case 'ADD_COLUMN':
            return {
                ...state,
                parkingLots: [action.payload, ...state.parkingLots].sort((a, b) => a.id - b.id)
            }
        case 'PARK':
            const { parkingLots, car, alreadyParked } = action.payload
            debugger;
            return {
                ...state,
                ...(!alreadyParked && {parkingLots: parkingLots}),
                parkedCars: [car, ...state.parkedCars]
            }
        case 'UNPARK':
        
        case 'ADD_ENTRY':
        
            break;
        case 'DELETE_ENTRY':
        
        case 'ERROR':
            return {
                ...state,
                loading: false,
            }
    
        default:
            break;
    }
}