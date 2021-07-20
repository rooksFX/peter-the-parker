export const mapVehicle = (parkingLots, payload, targetColumn) => {
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
    let lastColumns = new Array(4);
    let prevCol = 0;

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
        debugger;
        revertedLots.sort((a, b) => a.id - b.id);
        const columnToUpdate = revertedLots[currentCol];
        resolvePromise({ columnToUpdate, currentCol });
    };

    // Sort parking lots to linear arrangement
    const sortedLots = sortToLinear([...parkingLots], targetColumn);

    // const stairCaseTraverse = (col, row) => {
    //     console.log('traverse: ', col, row);
    //     const yLimit = row+col+1;
    //     const xLimit = col;
    //     let y = col;
    //     let x = row;
    //     console.log('yLimit: ', yLimit);
    //     while (y < yLimit && y < sortedLots.length && x < 3 && !parked) {
    //         console.log('y: ', y, 'x: ', x);

    //         for (let g = 0; g < 2; g++) {
    //             if (parked) break;
    //             for (let l = 0; l < 3; l++) {
    //                 if (parked) break;
    //                 const lot  = sortedLots[y].data[x][g][l];
    //                 if (l >= parseInt(size) && !lot) {
    //                     debugger;
    //                     sortedLots[y].data[x][g][l] = plateNumber;
    //                     parked = true;
    //                     revertLots(sortedLots, y);
    //                     break;
    //                 }
    //             }
    //         }

    //         // if (!test[y][x]) {
    //         //     test[y][x] = `${y}|${x}`;
    //         //     return test;
    //         // }

    //         y++;
    //         x--;
    //     }
    //     console.log('update: ', sortedLots);
    
    //     debugger;
    //     if (col < sortedLots.length && !parked) {
    //         col = row === 2? col+1: 0;
    //         row = row === 2? row: row+1;
    //         stairCaseTraverse(col, row);
    //     }
    //     else {
    //         // revertLots(null, null);
    //         // resolvePromise({ columnToUpdate: null, currentCol: null });
    //     }

    // }

    // Travese each column
    
    const traverseParkingLots = (currentCol) => {
        // debugger;
        const column = sortedLots[currentCol];
        const { data: colData, id: colId} = column;
        for (const rowIndex = lastRows[currentCol]+1 || 0; rowIndex < colData.length; rowIndex) {
            const row = colData[rowIndex];
            debugger;
            if (parked) break;
            for (const [groupIndex, group] of row.entries()) {
                debugger;
                if (parked) break;
                for (let [lotIndex, value] of group.entries()) {
                    debugger;
                    if (parked) break;
                    if (lotIndex >= parseInt(size) && !value) {
                        group[lotIndex] = plateNumber;
                        // console.log('LOT FOUND: ', sortedLots[currentCol].data[rowIndex][groupIndex][lotIndex]);
                        // console.log(`LOT FOUND LOCATION: ${currentCol}|${rowIndex}|${groupIndex}|${lotIndex}` );
                        parked = true;
                        revertLots(sortedLots, colId);
                        break;
                    }
                    else {
                        if (groupIndex === 1 && lotIndex === 2) {
                            if (lastRows[currentCol] === undefined) {
                                if (lastColumns[rowIndex] === undefined) lastColumns[rowIndex] = currentCol;
                                lastRows[currentCol] = rowIndex;
                                // left to right columns algo
                                // - Save record of the previous column that is not 0?
                                // - List of columns?
                                let nextCol = currentCol < columnsSize - 1? currentCol + 1: 0;
                                // let nextCol = currentCol === 0? currentCol < columnsSize? prevCol + 1: 0 : 0;
                                // if (currentCol === columnsSize - 1) prevCol = 0;
                                // if (nextCol > 0) prevCol = nextCol;
                                // if (nextCol !== targetColumn) lastRows[nextCol] = lastRows[nextCol] + 1;
                                // debugger;
                                traverseParkingLots(nextCol);
                            }
                            else {
                                if (lastRows[currentCol] < rowIndex) {
                                    lastRows[currentCol] = rowIndex;
                                    let nextCol = currentCol < columnsSize - 1? currentCol + 1: 0;
                                    traverseParkingLots(nextCol);
                                }
                            }
                        }
                        if (currentCol === columnsSize -1
                            && rowIndex === colData.length - 1
                            && groupIndex === row.length -1
                            && lotIndex === group.length -1) {
                                debugger;
                                console.log('End of the list');
                                resolvePromise({ columnToUpdate: null, currentCol: null });
                                parked = true;
                                break;
                            }
                    }
                }
            }
        }
    };

    // traverse(0, 0, 0, 0);
    traverseParkingLots(0);
    // stairCaseTraverse(0, 0);

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

const getExceedingHours = (hours) => {
    return hours % 24;
}

export const isBeyondOneHour = (exit) => {
    const current = window.exit || + new Date();
    const res = Math.abs(exit - current) / 1000;
    const minutes = Math.floor(res / 60) % 60;    
    return minutes >= 60;
}

export const getMinutesDifference = (time2, time1) => {
    console.info('getMinutesDifference');
    debugger;
    let diff =(time2 - time1) / 1000;
    diff /= 60;
    diff = Math.abs(Math.round(diff))
    console.log('diff: ', diff);
    return diff;
};

export const calculateTotal = (car, lotSize) => {
    debugger;
    let { timeIn, ogTimeIn } = car;
    const currentTimestamp = window.exit || + new Date();

    let total = 0;
    let hourlyRate = getHourlyRate(lotSize);
    let returningWithinOneHour = ogTimeIn !== timeIn;
    console.log('returningWithinOneHour: ', returningWithinOneHour);
    let hours = getHoursDifference(currentTimestamp, returningWithinOneHour? timeIn: ogTimeIn);
    let days = getDays(hours);
    let exceedingHours = getExceedingHours(hours);
    let extension = 0;
    debugger;
    if (hours > 3) { 
        if (returningWithinOneHour) {
            total += hours * hourlyRate;
        }
        else {
            extension = hours - 3;
            total = 40;
            total += extension * hourlyRate;
        }
        if (days > 1) total += days * 5000;
    }
    else {
        if (returningWithinOneHour) {
            total = hours * hourlyRate; 
        }
        else {
            total = 40;
        }
    }
    debugger;

    const entryString = returningWithinOneHour? new Date(timeIn).toLocaleString(): new Date(ogTimeIn).toLocaleString();
    const exitString = new Date(currentTimestamp).toLocaleString();

    return { entryString, exitString, total, hours, days, hourlyRate };
}
