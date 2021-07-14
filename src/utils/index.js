
const rowFilter = () => {

}

export const mapVehicle = (parkingLots, payload, index) => {
    let resolvePromise, rejectPromise;

    // Create promise that can be later resolved when a lot has already been found
    let parkPromise = new Promise((resolve, reject) => {
        resolvePromise = resolve
        rejectPromise = reject
    });

    const { plateNumber, size } = payload;
    const columnsSize = parkingLots.length;

    let parked = false;
    let lastRows = new Array(columnsSize);

    // Sort parking lots to linear arrangement
    const sortToLinear = (toSortParkingLots, target) => {
        // Get target column
        var mArray = [toSortParkingLots[target]];
        // Left side columns
        var fArray = toSortParkingLots.slice(0, target).reverse();
        // Right side columns
        var sArray = toSortParkingLots.slice(target+1, toSortParkingLots.length)
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
    const revertLots = (revertedLots, currentCol) => {
        revertedLots.sort((a, b) => a.id - b.id);
        const columnToUpdate = revertedLots[currentCol];
        debugger;
        resolvePromise({ columnToUpdate, currentCol });
    };

    // Sort parking lots to linear arrangement
    const sortedLots = sortToLinear([...parkingLots], index);

    // Travese each column
    const verticalSearch = (currentCol) => {
        const column = sortedLots[currentCol];
        const { data: colData, id: colId} = column;
        for (const rowIndex = lastRows[currentCol]+1 || 0; rowIndex < colData.length; rowIndex) {
            const row = colData[rowIndex];
            if (parked) break;
            for (const [groupIndex, group] of row.entries()) {
                if (parked) break;
                for (let [lotIndex , value] of group.entries()) {
                    if (parked) break;
                    if (lotIndex >= parseInt(size) && !value) {
                        group[lotIndex] = plateNumber;
                        console.log('LOT FOUND: ', sortedLots[currentCol].data[rowIndex][groupIndex][lotIndex]);
                        console.log(`LOT FOUND LOCATION: ${currentCol}|${rowIndex}|${groupIndex}|${lotIndex}` );
                        parked = true;
                        revertLots(sortedLots, colId);
                        break;
                    }
                    else {
                        if (groupIndex === 1 && lotIndex === 2) {
                            if (lastRows[currentCol] === undefined) {
                                lastRows[currentCol] = rowIndex;
                                let nextCol = currentCol < columnsSize - 1? currentCol + 1: 0;
                                verticalSearch(nextCol);
                            }
                            else {
                                if (lastRows[currentCol] < rowIndex) {
                                    lastRows[currentCol] = rowIndex;
                                    let nextCol = currentCol < columnsSize - 1? currentCol + 1: 0;
                                    verticalSearch(nextCol);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    verticalSearch(0);

    return parkPromise;
}

const getHoursDifference = (date) => {
    // debugger;
    const current = window.overrideDate || + new Date();
    // const difference = date.getTime() - current.getTime();
    // const hoursDifference = Math.floor(difference/1000/60/60);
    // difference -= hoursDifference*1000*60*60;

    const res = Math.abs(date - current) / 1000;
    const hours = Math.floor(res / 3600) % 24;      

    // const diff = Math.abs(current - date) / 36e5;
    return hours;
};

const getHourlyRate = (size) => {
    let hourlyRate = 0;
    hourlyRate = size === 0? 20: size === 1? 60: 100;
    return hourlyRate;
}

const getDays = (hours) => {
    return parseInt(hours / 24);
}

const getExceedingHours = (hours) => {
    return hours % 24;
}

export const isBeyondOneHour = (exit) => {
    // debugger;
    const current = window.overrideDate || + new Date();
    const res = Math.abs(exit - current) / 1000;
    const minutes = Math.floor(res / 60) % 60;    
    return minutes >= 60;
}

export const calculatTotal = (car, size) => {
    // debugger;
    let { timeIn: date } = car;
    let total = 40;
    let hourlyRate = getHourlyRate(size);
    let hours = getHoursDifference(date);
    let days = getDays(hours);
    let exceedingHours = getExceedingHours(hours);
    let extension = 0;

    if (hours > 3) { 
        extension = hours - 3;
        total += extension * hourlyRate;
        if (days > 1) total = days * 5000;
    }
    debugger;
    return { total, hours, days };
}
