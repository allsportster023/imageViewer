/*** Created by bslaugh on 7/7/17.

 */

import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {LineChart, Line, ReferenceLine, Dot, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid} from 'recharts';
import bboxPolygon from '@turf/bbox-polygon';
import intersect from '@turf/intersect';
import centroid from '@turf/centroid';
import CustomTooltip from './CustomTooltip';
import WeatherDropdown from './WeatherDropdown';
import '../styles/main.css';
import '../styles/weather-icons.min.css';


const MAX_GRAPH_HEIGHT = 400.0;

class CustomizedLabel extends React.Component {

    render() {

        const {x, stroke, value} = this.props;

        return (<g className="recharts-reference-line-label">
            <text stroke={stroke} fill="lightgray" x={x} dx={3} y="20"
                  className="recharts-text" textAnchor="right">
                <tspan x={x} dy="0em">{value}</tspan>
            </text>
        </g>)


    }

}

class WeatherObject extends React.Component {


    constructor(props) {

        super(props);


        this.availableFields = ["Precip", "Wind", "Clouds", "Temperature", "Soil", "Humidity"].sort();

        this.toggleWeatherField.bind(this);
        this.changeBuffer.bind(this);

        this.state = {

            selectedFields: ["Precip", "Wind", "Clouds", "Temperature"].sort(),
            loading: false,
            chartData: [],
            timeHourBuffer: 12

        }
    }

    componentWillUpdate(nextProps, nextState) {

        if (nextProps.images !== this.props.images || nextState.selectedFields !== this.state.selectedFields) {
            this.getWeatherDataForimages(nextProps);
        }

    }

    dateFormat(d) {

        const mt = moment(d).utc();
        return mt.format('MMMM D, HH') + "00Z"

    }

    changeBuffer(e) {

        const bufferVal = document.querySelector(e).value;
        this.setState({
            timeHourBuffer: bufferVal
        });
    }

    toggleWeatherField(e) {

        const checked = document.querySelector(e).checked;
        const field = e.replace("Switch", "").replace("#", "");

        //element is in there and it is false (not checked), remove it
        if (!checked) {
            const indexToRemove = this.state.selectedFields.indexOf(field);
            this.state.selectedFields.splice(indexToRemove, 1);
        } else {

            //If we already have 4 weather fields selected, remove the last one.
            if (this.state.selectedFields.length === 4) {
                this.state.selectedFields.pop();
            }

            this.state.selectedFields.push(field);
        }

        console.log(this.state.selectedFields);

        this.setState({
            selectedFields: this.state.selectedFields.concat([]).sort()
        });
    }


    calculateIntersection(imageArray) {
        let validCount = 0;
        let validIndex = 0;

        for (let i = 0; i < imageArray.length; i++) {
            if (imageArray[i] !== null) {
                validCount++;
                validIndex = i;
            }

        }

        //Close out early if we only have one valid image loaded (to save speed and processing power)
        if (validCount === 1) {

            let diffLat = (Math.abs(imageArray[validIndex].location[0] -
                imageArray[validIndex].location[2]) / 2) +
                Math.min(imageArray[validIndex].location[0],
                    imageArray[validIndex].location[2]);

            let diffLon = (Math.abs(imageArray[validIndex].location[1] -
                imageArray[validIndex].location[3]) / 2) +
                Math.min(imageArray[validIndex].location[1],
                    imageArray[validIndex].location[3]);

            return [Math.round(diffLat * 100) / 100, Math.round(diffLon * 100) / 100];
        } else if (validCount === 0) {
            return null;
        }

        let allIntersect = true;
        let geojsons = [];

        for (let i = 0; i < imageArray.length; i++) {

            for (let j = 1; j < imageArray.length && imageArray[i] !== null && imageArray[j] !== null; j++) {

                let firstLocation = bboxPolygon(imageArray[i].location);
                geojsons.push(firstLocation);

                if (intersect(firstLocation, bboxPolygon(imageArray[j].location)) === null) {

                    allIntersect = false;

                    console.log("Some of the images do not intersect");
                    return null;

                }

            }

        }


        if (allIntersect) {

            console.log("They intersect!");

            let intersectionPolygon = geojsons[0];

            for (let i = 1; i < geojsons.length; i++) {

                intersectionPolygon = intersect(intersectionPolygon, geojsons[i]);

            }


            let center = centroid(intersectionPolygon);


            return [center.geometry.coordinates[0].toFixed(2), center.geometry.coordinates[1].toFixed(2)]

        } else {

            return null;

        }

    }

    getWeatherDataForimages(nextProps) {


        console.log("Getting Weather Data for all images");

        const _this = this;

        let dates = [];


        for (let i = 0; i < nextProps.images.length && nextProps.images.length > 0; i++) {

            if (nextProps.images[i] !== null) {
                dates.push(moment(nextProps.images[i].datetime).utc());
            }
        }

        const maxDate = moment(Math.max.apply(null, dates)).utc();
        const minDate = moment(Math.min.apply(null, dates)).utc();

        maxDate.add(this.state.timeHourBuffer, 'hours');
        minDate.subtract(this.state.timeHourBuffer, 'hours');

//Round the earliest date down to the nearest 3 hour interval 
        minDate.startOf('hour');

        minDate.subtract(minDate.hour() % 3, 'hours');

//Round the latest data up to the nearest 3 hour interval 
        maxDate.minute() || maxDate.second() || maxDate.millisecond() ?
            maxDate.add(1, 'hour').startOf('hour') : maxDate.startOf('hour');

        maxDate.add(3 - (maxDate.hour() % 3), 'hours');

// console.log("Min and Max Datetime:"};
// console.log(minDate.format(}};
// console.log(maxDate.format()};

        let currDate = minDate.clone();

        let bbox = this.calculateIntersection(nextProps.images.concat([]));

        console.log(bbox);

// bbox = [5, 20, 40, 50];

        let axiosCalls = [];

        while (currDate <= maxDate) {

// console.log(currDate.format(}};
            //For each field that is selected

            const fields = this.state.selectedFields;
            for (let k = 0; k < fields.length; k++) {

                let urlPrefix = "http://localhost:8080/geoserver/wcs?request=GetCoverage&service=WCS&version=2.0.1&Format=text/plain";

                let wcsField = "";

//Set the URL field for the OGC services 
                let postCoverage = "";

                if (fields[k] === "Precip") {
                    wcsField = "LIS_Ground_";
                    postCoverage = "_Precip";

                    if (bbox.length === 4) {
                        urlPrefix += "&subset=Long(";
                        urlPrefix += (+bbox[1] + 360.0) + "," + (+bbox[3] + 360.0);
                        urlPrefix += ")&subset=Lat(";
                        urlPrefix += bbox[0] + "," + bbox[2] + ")";
                    } else if (bbox.length === 2) {
                        urlPrefix += "&subset=Long(";
                        urlPrefix += (+bbox[1] + 360.0);
                        urlPrefix += ")&subset=Lat(";
                        urlPrefix += bbox[0] + ")";

                    }

                    // console.log(urlPrefix + "&coverageid=weather_" + wcsField +currDate.utc().format() + postCoverage};
                    axiosCalls.push(axios.get(urlPrefix + "&coverageId=weather__" +
                        wcsField + currDate.utc().format() + postCoverage, {
                        fieldName: 'Precip',
                        dateTime: currDate.utc().format()
                    }).catch(function (d) {
                        return null;
                    }));

                } else if (fields[k] === "Clouds") {
                    wcsField = "WWMCAM_";
                    postCoverage = "_Clouds";

                    if (bbox.length === 4) {

                        urlPrefix += "&subset=Long(";
                        urlPrefix += bbox[1] + "," + bbox[3];
                        urlPrefix += ")&subset=Lat(";
                        urlPrefix += bbox[0] + "," + bbox[2] + ")";
                    } else if (bbox.length === 2) {
                        urlPrefix += "&subset=Long(";
                        urlPrefix += (Math.round(+bbox[1] * 10) / 10);
                        urlPrefix += ")&subset=Lat(";
                        urlPrefix += (Math.round(+bbox[0] * 10) / 10) + ")";

                    }

// console.log(urlPrefix + "&coverageid=weather_" + wcsField +currDate.utc(}.format(}+.postCoverage};
                    axiosCalls.push(axios.get(urlPrefix + "&coverageId=weather__" + wcsField + currDate.utc().format() + postCoverage, {
                        fieldName: 'Clouds',
                        dateTime: currDate.utc().format()
                    }).catch(function (d) {
                        return null;
                    }));

                } else if (fields[k] === "Wind") {

//Only process on the 6-hour increments.
                    if (currDate.hours() === 0 || currDate.hours() === 6 || currDate.hours() === 12 || currDate.hours() === 18) {

                        wcsField = "GALWEM_";
                        postCoverage = "_XWind";
                        if (bbox.length === 4) {

                            urlPrefix += "&subset=Long(";
                            urlPrefix += bbox[1] + "," + bbox[3];
                            urlPrefix += ")&subset=Lat(";
                            urlPrefix += bbox[0] + "," + bbox[2] + ")";
                        } else if (bbox.length === 2) {
                            urlPrefix += "&subset=Long(";
                            urlPrefix += (+bbox[1]);
                            urlPrefix += ")&subset=Lat(";
                            urlPrefix += bbox[0] + ")";

                        }

// console.log(urlPrefix + "&coverageid=weather_" +wcsField + currDate.utc().format(}+postCoverage};

                        axiosCalls.push(axios.get(urlPrefix + "&coverageId=weather__" + wcsField + currDate.utc().format() + postCoverage, {

                            fieldName: 'WindX',
                            dateTime: currDate.utc().format()

                        }).catch(function (d) {
                            return null;
                        }));

                    }

                    wcsField = "GALWEM_";
                    postCoverage = "_YWind";

// console.log(urlPrefix + "&coverageid=weather_" +wcsField + currDate.utc().format(}+postCoverage};

                    axiosCalls.push(axios.get(urlPrefix + "&coverageId=weather__" + wcsField + currDate.utc().format() + postCoverage, {

                        fieldName: 'WindY',
                        dateTime: currDate.utc().format()

                    }).catch(function (d) {
                        return null;
                    }));
                } else if (fields[k] === "Temperature") {
                    wcsField = "LIS_Ground_";
                    postCoverage = "_Temp";

                    if (bbox.length === 4) {

                        urlPrefix += "&subset=Long(";
                        urlPrefix += (+bbox[1] + 360.0) + "," + (+bbox[3] + 360.0);
                        urlPrefix += ")&subset=Lat(";
                        urlPrefix += bbox[0] + "," + bbox[2] + ")";

                    } else if (bbox.length === 2) {
                        urlPrefix += "&subset=Long(";
                        urlPrefix += (+bbox[1] + 360.0);
                        urlPrefix += ")&subset=Lat(";
                        urlPrefix += bbox[0] + ")";

                    }

// console.log(urlPrefix + "&coverageid=weather_" + wcsField +currDate.utc(}.format(}+postCoverage};
                    axiosCalls.push(axios.get(urlPrefix + "&coverageid=weather__" +

                        wcsField + currDate.utc().format() + postCoverage, {
                        fieldName: 'Temperature',
                        dateTime: currDate.utc().format()

                    }).catch(function (d) {
                        return null;
                    }));

                }

            }

            currDate.add(3, "hours");

        }

        //TODO Get rid of. Testing only
        axiosCalls.push(axios.get("https://httpbin.org/delay/3"));


        this.setState({loading: true}, () => {
            axios.all(axiosCalls)
                .then(function (dataArray) {

                    let weatherObjectArr = [];

                    for (let i = 0, len = dataArray.length; i < len; i++) {
                        console.log(dataArray[i]);

                        if (dataArray[i] !== null) { // Process the data if it is not null

                            let weatherObject = weatherObjectArr.find(function (d) {
                                return dataArray[i].config.dateTime === d.date;
                            });

//If this is the first time for this datetime 
                            let alreadyHaveObj = true;

                            if (!weatherObject) {

                                alreadyHaveObj = false;
                                weatherObject = {};

                                weatherObject["date"] = dataArray[i].config.dateTime;
                                weatherObject["time"] = moment(dataArray[i].config.dateTime).utc().valueOf();

                            }

//Split the data string by spaces and newlines
                            const splitData = dataArray[i].data.replace(/\r?\n?\s/g, '  ').split('  ');

//Get the sum total starting at index 12 to throw-out theheader data
                            let sum = 0;
                            let cnt = 0;

                            for (let a = 12, len2 = splitData.length; a < len2; a++) {
                                if (splitData[a] !== "-9999" && splitData[a] !== "") {
                                    sum += +splitData[a];
                                    cnt++;
                                }
                            }


//If we are working with a wind field
                            if (dataArray[i].config.fieldName.includes("Wind")) {

                                if (weatherObject.hasOwnProperty("Wind")) {
                                    weatherObject["Wind"] = Math.sqrt(Math.pow(weatherObject["Wind"], 2) +
                                        Math.pow((sum / cnt), 2))

                                } else {

                                    weatherObject["Wind"] = (sum / cnt);

                                }

                            } else { // All other fields/values
                                weatherObject[dataArray[i].config.fieldName] = (sum / cnt);
                            }

// console.log(weatherObject};
                            if (alreadyHaveObj) {
                                const foundIndex = weatherObjectArr.findIndex(x => x.date === weatherObject.date);
                                weatherObjectArr[foundIndex] = weatherObject;
                            } else {
                                weatherObjectArr.push(weatherObject);
                            }
                        }
                    }

                    let minMaxValues = {};

                    //Now go through the weather objects to see if any fields are missing
                    for (let i = 0, len = weatherObjectArr.length; i < len; i++) {

//For each of the selected fields, check if it exists

                        for (let j = 0, len2 = _this.state.selectedFields.length; j < len2; j++) {

//If this weahter object does not have one of the selected fields

                            if (!weatherObjectArr[i].hasOwnProperty(_this.state.selectedFields[j])) {

// console.log(weatherObjectArr[i]);
//Find the previous value

                                let wantedTime = moment(weatherObjectArr[i].date).utc();
                                wantedTime = wantedTime.subtract(3, 'hours');

// console.log(wantedTime.format(});

                                let wantedObject = weatherObjectArr.find(function (d) {
                                    return moment(d.date).utc().format() === wantedTime.utc().format();

                                });

// console.log(wantedObject};
//If we found a useable value, use it
                                if (wantedObject) {

                                    weatherObjectArr[i][_this.state.selectedFields[j]] = wantedObject[_this.state.selectedFields[j]] / 1.943844;

                                } else { //If we did not find it, look in the future instead to find the nearest value

                                    wantedTime = wantedTime.add(6, 'hours');

// console.log(wantedTime.format(}};

                                    wantedObject = weatherObjectArr.find(function (d) {
                                        return moment(d.date).utc().format() === wantedTime.utc().format();
                                    });

                                    weatherObjectArr[i][_this.state.selectedFields[j]] = wantedObject[_this.state.selectedFields[j]];

                                }

// console.log(weatherObjectArr[i]};
                            }
//Process this object

                            if (_this.state.selectedFields[j] === "Precip") {
                                weatherObjectArr[i]["PrecipUnits"] = " mm";

                            } else if (_this.state.selectedFields[j] === "Wind") {
                                weatherObjectArr[i]["WindUnits"] = " kts";
                                weatherObjectArr[i][_this.state.selectedFields[j]] =
                                    +weatherObjectArr[i][_this.state.selectedFields[j]] * 1.943844;

                            } else if (_this.state.selectedFields[j] === "Clouds") {
                                weatherObjectArr[i]["CloudsUnits"] = "%";

                            } else if (_this.state.selectedFields[j] === "Temperature") {
                                weatherObjectArr[i]["TemperatureUnits"] = "°C";
//Convert the temp to Celsius 

                                weatherObjectArr[i][_this.state.selectedFields[j]] = +weatherObjectArr[i][_this.state.selectedFields[j]] - 273.15;

                            }

                            if ((!minMaxValues[_this.state.selectedFields[j] + "min"] && minMaxValues[_this.state.selectedFields[j] + "min"] !== 0) || minMaxValues[_this.state.selectedFields[j] + "min"] > weatherObjectArr[i][_this.state.selectedFields[j]])
                                minMaxValues[_this.state.selectedFields[j] + "min"] = weatherObjectArr[i][_this.state.selectedFields[j]];

                            if ((!minMaxValues[_this.state.selectedFields[j] + "max"] && minMaxValues[_this.state.selectedFields[j] + "max"] !== 0) || minMaxValues[_this.state.selectedFields[j] + "max"] < weatherObjectArr[i][_this.state.selectedFields[j]])
                                minMaxValues[_this.state.selectedFields[j] + "max"] = weatherObjectArr[i][_this.state.selectedFields[j]];

                        }
// console.log(weatherObjectArr[i]};

                    }


// console.log(minMaxValues};

//flip the fields to make the Normalization easier

                    let flippedFields = _this.state.selectedFields.concat([]);
                    flippedFields.reverse();

                    const maxPerFieldHeight = MAX_GRAPH_HEIGHT / flippedFields.length;
                    const fieldOffset = 0.05 * maxPerFieldHeight;

                    for (let i = 0, len = flippedFields.length; i < len; i++) {
                        const maxVal = maxPerFieldHeight - fieldOffset + (i * maxPerFieldHeight);
                        const minVal = (i * maxPerFieldHeight) + fieldOffset;

                        for (let j = 0, len2 = weatherObjectArr.length; j < len2; j++) {
                            weatherObjectArr[j]["orig" + flippedFields[i]] = weatherObjectArr[j][flippedFields[i]];

                            if (minMaxValues[flippedFields[i] + "max"] === 0) {
                                minMaxValues[flippedFields[i] + "max"] = 1;

                            }

//console.log(minMaxValues[flippedFields[i] +"max"]); 
//console.log(minMaxValues[flippedFields[i] +"min"]);

                            weatherObjectArr[j][flippedFields[i]] = minVal + (weatherObjectArr[j][flippedFields[i]] -
                                minMaxValues[flippedFields[i] + "min"]) * (maxVal - minVal)
                                / (minMaxValues[flippedFields[i] + "max"] - minMaxValues[flippedFields[i] + "min"]);
                        }
                    }

                    console.log(weatherObjectArr);

                    console.log("Completed pulling all Weather Data");

                    _this.setState({
                        chartData: weatherObjectArr,
                        loading: false
                    });
                })
                .catch(function (error) {
                    console.log(error);
                    _this.setState({loading: false});
                });
        });
    }

    render() {
        console.log("Rendering WeatherObject with data:");
        console.log(this.state.chartData);


//IF YOU CHANGE THESE, CHANGE THEM IN main.css ALSO
        let colors = {};
        colors["Precip"] = "green";
        colors["Temperature"] = "red";
        colors["Clouds"] = "cyan";
        colors["Wind"] = "blue";
        const _this = this;

        return (
            <div style={{position: "relative"}}>
                <div className={this.state.loading ? "overlay" : ""}>
                    <table style={{width: "100%", height: "280px"}}>
                        <tbody>
                        <tr className="chart-stl">

                            <td style={{paddingTop: "15px"}} className="chart-label">
                                <WeatherDropdown fields={_this.availableFields}
                                                 selectedFields={_this.state.selectedFields}
                                                 toggleWeatherField={_this.toggleWeatherField.bind(_this)}
                                                 changeBuffer={_this.changeBuffer.bind(_this)}/>

                                <ul className="vertGrp">

                                    {this.state.selectedFields.map(function (k, idx) {

//Set the text and the icons for the side legend 
                                        let iconName;
                                        let iconText = k;

                                        if (k === "Precip") {
                                            iconName = "wi-rain";
                                            iconText = "Precip"
                                        } else if (k === "Wind") {
                                            iconName = "wi-strong-wind";
                                        } else if (k === "Clouds") {
                                            iconName = "wi-cloudy";
                                        } else if (k === "Temperature") {
                                            iconName = "wi-thermometer";
                                            iconText = "Temp"
                                        } else if (k === "Humidity") {
                                            iconName = "wi-humidity";
                                        } else if (k === "Soil") {
                                            iconName = "wi-dust";
                                        }

                                        return (<li key={idx} className="tableYaxisLabels">
                                            {iconText}
                                            <i className={"wi " + iconName + " icon-stl"}/>
                                        </li>)
                                    })}
                                </ul>
                            </td>
                            <td>
                                <ResponsiveContainer>
                                    <LineChart data={this.state.chartData}
                                               margin={{top: 30, right: 30, left: -50, bottom: 0}}
                                               style={{float: "left", stroke: "lpx solid red"}}>

                                        <CartesianGrid stroke={'rgba(0,0,0,0.3)'}
                                                       strokeDashArray={"3 3"} vertical={false}/>

                                        <XAxis dataKey="time" tick={{stroke: 'white'}}
                                               tickLine={{stroke: 'white'}}
                                               axisLine={{stroke: 'white'}}
                                               padding={{left: 0, right: 0}}
                                               tickFormatter={this.dateFormat}
                                               domain={['dataMin', 'dataMax']}
                                               type={"number"}
                                               interval="preserveStartEnd"/>

                                        <YAxis axisLine={false} tickLine={false}
                                               ticks={this.state.selectedFields}
                                               domain={[0, MAX_GRAPH_HEIGHT]}/>

                                        <Tooltip content={<CustomTooltip/>}/>

                                        {this.state.selectedFields.map(function (k, idx) {

                                            return (
                                                <Line key={idx} type='monotone' dataKey={k}
                                                      stroke={colors[k.charAt(0).toUpperCase() + k.slice(1)]}
                                                      dot={false}/>)

                                        })}

                                        {this.props.images.map(function (e, idx) {

                                            if (e !== null) {

                                                let momentDateTime = moment(e.datetime).utc();

                                                return (<ReferenceLine key={idx}
                                                                       x={momentDateTime.valueOf()}
                                                                       label={<CustomizedLabel value={e.id}/>}
                                                                       stroke="lightgray"/>);
                                            }

                                            return null;

                                        })}

                                        <Dot r={0}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {!this.state.loading ? "" : (<div className={"over"}>
                    <img src={"http://diysolarpanelsv.com/images/rain-animated-clipart-8.gif"} height={280} width={"50%"} alt={"Loading"}/>
                    <img src={"http://diysolarpanelsv.com/images/rain-animated-clipart-8.gif"} height={280} width={"50%"} alt={"Loading"}/>

                    </div>)}
            </div>
        )
    }
}

export default WeatherObject