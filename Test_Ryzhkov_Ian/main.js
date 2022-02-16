function getSeconds(string) {
    const time = string.split(':');
    const seconds = +time[0] * 3600 + (+time[1]) * 60 + +time[2]
    return seconds;
}

function wayTimeDifference(timeStart, timeFinish) {
    return (timeFinish - timeStart < 0 ? (timeFinish - timeStart + 86400) : (timeFinish - timeStart));
}

function timeArray(arr) {
    return arr.map(item => {
        let str = [];
        Math.trunc(item / 3600) < 9 ? str.push('0' + Math.trunc(item / 3600)) : str.push(Math.trunc(item / 3600) + '');
        Math.trunc(item / 3600) < 9 ? str.push('0' + Math.round(item % 3600 / 60)) : str.push(Math.round(item % 3600 / 60) + '');
        str.push('00');
        return str.join(':');
    });
}

function sumItems(arr) {
    return arr.map(item => +item.reduce((sum, elem) => sum + elem, 0).toFixed(2));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//todo: connect JSON database
var xhr = new XMLHttpRequest();
xhr.open("GET", "data.json", false);
xhr.send(null);
data = JSON.parse(xhr.responseText)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var allStationList = [1902, 1909, 1921, 1929, 1937, 1981]


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get array from object
data = Object.values(data).map(i => Object.values(i))
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create new way time attribute in objects
for (let i = 0; i < data.length; i++) {
    data[i].push(wayTimeDifference(getSeconds(data[i][4]), getSeconds(data[i][5])))
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create stations array
function stationsArray(arr) {
    const stations = new Set();
    for (let i = 0; i < Object.keys(arr).length; i++) {
        stations.add(arr[i][1]);
    }
    return stations;
}
allStationList = stationsArray(data)
allStationList = Array.from(allStationList)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// best time search function
function bestTime(arr, stations, stationsNumber) {
    const fastestWay = [];
    const way = [];
    let i = 0;
    const stationsWay = [+stations];

    while (i < stationsNumber - 1) { // the cycle will be repeated until the train has passed all the stations
        for (let n = 0; n < arr.length; n++) {
            if (stationsWay[i] === arr[n][1]) { // if the current station matches a station from the array
                if (!fastestWay[i] && (stationsWay.every(element => element !== arr[n][2]))) {
                    fastestWay[i] = arr[n][6];
                    way[i] = arr[n]; // add way
                    stationsWay.push(way[i][2]); // add new station
                } else if (fastestWay[i] >= arr[n][6] && (stationsWay.every(element => element !== arr[n][2]))) {
                    fastestWay[i] = arr[n][6];
                    way[i] = arr[n]; // add way
                    stationsWay[i + 1] = way[i][2]; // overwrite
                }
            }
        }
        i++;
    }
    return (way.length === stationsNumber - 1) ? way : null; // if way is not complete, return null
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// best cost search function
function bestCost(arr, stations, stationsNumber) {
    const bestWayCost = [];
    const way = [];
    let i = 0;
    const stationsWay = [+stations];

    while (i < stationsNumber - 1) {
        for (let n = 0; n < arr.length; n++) {
            if (stationsWay[i] === arr[n][1]) {


                if (!bestWayCost[i] && (stationsWay.every(element => element !== arr[n][2]))) {
                    bestWayCost[i] = arr[n][3];
                    way[i] = arr[n];
                    stationsWay.push(way[i][2]);
                } else if (bestWayCost[i] >= arr[n][3] && (stationsWay.every(element => element !== arr[n][2]))) {
                    bestWayCost[i] = arr[n][3];
                    way[i] = arr[n];
                    stationsWay[i + 1] = way[i][2];
                }
            }
        }
        i++;
    }
    return (way.length === stationsNumber - 1) ? way : null;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create best time station array
let allWayCost = allStationList.map((item) => {
    return bestCost(data, item, allStationList.length);
});
allWayCost = allWayCost.filter(way => way !== null); // way sorting
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RESULT
console.log('several path options with minimal time costs: ');
console.log(allWayCost);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create best cost station array
let allWayTime = allStationList.map((item) => {
    return bestTime(data, item, allStationList.length);
});
allWayTime = allWayTime.filter(way => way !== null);
let TimeInWay = allWayTime.map(item => item.map(element =>
    element[6]
));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RESULT
console.log('several options for the path with minimal financial costs: ');
console.log(allWayTime);
console.log('total travel time across all stations for all variants: ');
console.log(timeArray(sumItems(TimeInWay)));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




