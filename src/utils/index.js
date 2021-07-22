export const mapVehicle = (parkingLots, payload, entryPoint) => {
    let resolvePromise, rejectPromise;

    let parked = false;

    // Create promise that can be later resolved when a lot has already been found
    let parkPromise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });

    const { plateNumber, size } = payload;

    // Sort parking lots to linear arrangement
    const sortToLinear = (toSortParkingLots, target) => {
        // Get target column
        var mArray = [toSortParkingLots[target]];
        // Left side columns
        var fArray = toSortParkingLots.slice(0, target).reverse();
        // Right side columns
        var sArray = toSortParkingLots.slice(target+1, toSortParkingLots.length);
        // Total length of divided arrays
        var totalLength = mArray.length + fArray.length + sArray.length;
        for (let i = 0; i < totalLength; i ++) {
            // Adds back the left and right columns to the main array
            // From [A, B, C, D, E] where C is the selected
            // To [C, B, D, A, E]
            if (fArray[i]) mArray.push(fArray[i]);
            if (sArray[i]) mArray.push(sArray[i]);
        }
        return mArray;
     };

    // Reverts the parking lots to the orginal arrangement
    const revertParkingLots = (revertedLots, currentCol) => {
        revertedLots.sort((a, b) => a.id - b.id);
        const columnToUpdate = revertedLots[currentCol];
        resolvePromise({ columnToUpdate, currentCol });
    };

    // Sort parking lots to linear arrangement
    const sortedLots = sortToLinear([...parkingLots], entryPoint);

    const search = () => {

        // Level is actually the row per column
        for (let level = 0; level < 3; level++) {

            if (parked) break;

            for (let colIndex = 0; colIndex < sortedLots.length; colIndex++) {

                if (parked) break;

                // Current column
                const column = sortedLots[colIndex];
                const { id, data } = column;
                // Is current column left side of target column
                const isLeftSide = id < entryPoint;
                // Directly extract row
                const rows = data[level];

                for (let groupLevel = 0; groupLevel < 3; groupLevel++) {

                    if (parked) break;

                    const fLot = isLeftSide? 1: 0;
                    const sLot = isLeftSide? 0: 1;

                    if (groupLevel >= parseInt(size) && !rows[fLot][groupLevel]) {
                        rows[fLot][groupLevel] = plateNumber;
                        parked = true;

                        revertParkingLots(sortedLots, id);
                        break;
                    }
                    if (groupLevel >= parseInt(size) && !rows[sLot][groupLevel]) {
                        rows[sLot][groupLevel] = plateNumber;
                        parked = true;

                        revertParkingLots(sortedLots, id);
                        break;
                    }
                }
            }
        }
        if (!parked) resolvePromise({ columnToUpdate: null, currentCol: null });   
    }

    search();

    return parkPromise;
}

const getHoursDifference = (timeOut = window.exit || + new Date(), timeIn) => {
    const res = timeOut - timeIn;
    const hoursDiff = (((res / 1000) / 60)/ 60);
    const mathCeilHoursDiff = Math.ceil(hoursDiff);
    return mathCeilHoursDiff;
};

const getHourlyRate = (size) => {
    let hourlyRate = 0;
    hourlyRate = size === 0? 20: size === 1? 60: 100;
    return hourlyRate;
}

const getDays = (hours) => {
    return parseInt(hours / 24);
}

export const isBeyondOneHour = (exit) => {
    const current = window.exit || + new Date();
    const res = Math.abs(exit - current) / 1000;
    const minutes = Math.floor(res / 60) % 60;    
    return minutes >= 60;
}

export const getMinutesDifference = (time2, time1) => {
    let diff =(time2 - time1) / 1000;
    diff /= 60;
    diff = Math.abs(Math.round(diff))
    return diff;
};

export const calculateTotal = (car, lotSize) => {
    let { timeIn, ogTimeIn } = car;
    const currentTimestamp = window.exit || + new Date();

    let total = 0;
    let hourlyRate = getHourlyRate(lotSize);
    let returningWithinOneHour = ogTimeIn !== timeIn;
    let hours = getHoursDifference(currentTimestamp, returningWithinOneHour? timeIn: ogTimeIn);
    let days = getDays(hours);
    let extension = 0;
    if (hours > 3) { 
        if (returningWithinOneHour) {
            total += hours * hourlyRate;
        }
        else {
            extension = hours - 3;
            total = 40;
            total += extension * hourlyRate;
        }
        if (days >= 1) total += days * 5000;
    }
    else {
        if (returningWithinOneHour) {
            total = hours * hourlyRate; 
        }
        else {
            total = 40;
        }
        if (days >= 1) total += days * 5000;
    }

    const entryString = returningWithinOneHour? new Date(timeIn).toLocaleString(): new Date(ogTimeIn).toLocaleString();
    const exitString = new Date(currentTimestamp).toLocaleString();

    const lotSizelabel = lotSize === 0? 'Small': lotSize === 1? 'Medium': 'Large';

    return { entryString, exitString, total, hours, days, hourlyRate, lotSizelabel};
}
