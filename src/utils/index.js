
const rowFilter = () => {

}

export const mapVehicle = (lots, payload) => {
    let resolvePromise, rejectPromise;
    let parkPromise = new Promise((resolve, reject) => {
        resolvePromise = resolve
        rejectPromise = reject
    });
    const { plateNumber, size, columnIndex: index } = payload;
    const columnsSize = lots.length;
    // let currentCol = index;
    let parked = false;
    let lastRows = new Array(columnsSize);

    const sortToLinear = (toSortLots, target) => {
        // // debugger;
        var mArray = [toSortLots[target]];
        var fArray = toSortLots.slice(0, target).reverse();
        var sArray = toSortLots.slice(target+1, toSortLots.length)
        var totalLength = mArray.length + fArray.length + sArray.length;
        // console.log('fArray: ', fArray);
        // console.log('sArray: ', sArray);
        for (let i = 0; i < totalLength; i ++) {
            if (fArray[i]) mArray.push(fArray[i]);
            if (sArray[i]) mArray.push(sArray[i]);
            // console.log('mArray: ', mArray);
        }
        return mArray;
     };

    const revertLots = (revertedLots, currentCol) => {
        // console.log('lastRows: ', lastRows);
        // console.log('revertLots: ', lots);
        revertedLots.sort((a, b) => a.id - b.id)
        resolvePromise({revertedLots, currentCol});
    };

    // console.log('lots, index: ', lots, index);
    debugger;
    const sortedLots = sortToLinear([...lots], index);
    // console.log('sortedLots: ', sortedLots);

    const verticalSearch = (currentCol) => {
        console.log('currentCol: ', currentCol);
        debugger;
        let col = sortedLots[currentCol].data;
        for (const rowIndex = lastRows[currentCol]+1 || 0; rowIndex < col.length; rowIndex) {
        // for (const [rowIndex, row] of col.entries()) {
            const row = col[rowIndex];
            if (parked) break;
            // debugger;
            for (const [groupIndex, group] of row.entries()) {
                if (parked) break;
                // debugger;
                for (let [lotIndex , value] of group.entries()) {
                    if (parked) break;
                    // debugger;
                    if (lotIndex >= parseInt(size) && !value) {
                        group[lotIndex] = plateNumber;
                        // console.clear();
                        console.log('LOT FOUND: ', sortedLots[currentCol].data[rowIndex][groupIndex][lotIndex]);
                        console.log(`LOT FOUND LOCATION: ${currentCol}|${rowIndex}|${groupIndex}|${lotIndex}` );
                        parked = true;
                        revertLots(sortedLots, currentCol);
                        break;
                    }
                    else {
                        // debugger;
                        if (groupIndex === 1 && lotIndex === 2) {
                            // debugger;
                            if (lastRows[currentCol] === undefined) {
                                lastRows[currentCol] = rowIndex;
                                // debugger;
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
    debugger;
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
    debugger;
    const current = window.overrideDate || + new Date();
    const res = Math.abs(exit - current) / 1000;
    const minutes = Math.floor(res / 60) % 60;    
    return minutes >= 60;
}

export const calculatTotal = (car, size) => {
    debugger;
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
    return total;
}
