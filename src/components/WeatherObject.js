/**
 * Created by bslaugh on 7/7/17.
 */

import React from 'react';
import moment from 'moment';
import {LineChart, Line, ReferenceLine, Dot, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';


class WeatherObject extends React.Component {

  constructor(props) {
    super(props);

    this.fields = ["Rain", "Hail", "T-Storms", "Fires", "Earthquake", "Wind"];

  }

  componentDidMount() {
    //http://earthserver.ecmwf.int/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=precipitation&SUBSET=Lat(35)&SUBSET=Long(35)&FORMAT=application/json
    let fakeVal = {}
  }


  dateFormat(d) {
    const mt = moment(d);
    return mt.format('MMMM D, HH') + "00Z"
  }

  render() {

    let colors = {};
    colors["Rain"] = "lightblue";
    colors["Hail"] = "white";
    colors["Thunderstorms"] = "lightgreen";
    colors["Fire"] = "red";
    colors["Earthquake"] = "#ff30f5";
    colors["Wind"] = "orange";


    let keys = [];

    for (const key of Object.keys(realData[0])) {
      if (key != "date")
        keys.push(key)
    }

    return (
      <div>
        <table>
          <tbody>
          <tr className="chart-stl">
            <td style={{paddingTop: "15px"}} className="chart-label">
              <p className="tableYaxisLabels">
                Precip
                <i className="wi wi-rain icon-stl"></i>
              </p>
              <p className="tableYaxisLabels">
                Wind
                <i className="wi wi-strong-wind icon-stl"></i>
              </p>
              <p className="tableYaxisLabels">
                Fires
                <i className="wi wi-fire icon-stl"></i>
              </p>
              <p className="tableYaxisLabels">
                T-Storms
                <i className="wi wi-storm-showers icon-stl"></i>
              </p>
            </td>
            <td>
              <LineChart width={1200} height={250} data={realData} syncId="anyId"
                         margin={{top: 0, right: 30, left: -50, bottom: 0}} style={{float: "left"}}>

                <XAxis dataKey="date" tick={{stroke:'white'}} tickLine={{stroke:'white'}} axisLine={{stroke:'white'}} interval="preserveStartEnd" padding={{left: 0, right: 0}} tickFormatter={this.dateFormat}/>
                <YAxis axisLine={false} tickLine={false} ticks={this.fields}/>

                <Tooltip itemSorter={(item1, item2) => 1} wrapperStyle={{color: 'black'}}/>

                {keys.map(function (k, idx) {
                  return (
                    <Line key={idx} type='monotone' dataKey={k} stroke={colors[k.charAt(0).toUpperCase() + k.slice(1)]}
                          dot={false}/>)
                })}

                <ReferenceLine x="2017-07-02T03:00:00Z" stroke="lightgray"/>
                <ReferenceLine x="2017-07-06T03:00:00Z" stroke="lightgray"/>
                <ReferenceLine x="2017-07-10T06:00:00Z" stroke="lightgray"/>
                <Dot r={0}/>
              </LineChart>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
export default WeatherObject

const realData = [{
  "date": "2017-07-01T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 239,
  "precipitation": 394
}, {
  "date": "2017-07-01T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 233,
  "precipitation": 399
}, {
  "date": "2017-07-01T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 260,
  "precipitation": 362
}, {
  "date": "2017-07-01T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 257,
  "precipitation": 412
}, {
  "date": "2017-07-01T15:00:00Z",
  "thunderstorms": 100,
  "fire": 120,
  "wind": 272,
  "precipitation": 409
}, {
  "date": "2017-07-01T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 276,
  "precipitation": 364
}, {
  "date": "2017-07-01T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 291,
  "precipitation": 416
}, {
  "date": "2017-07-02T00:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 256,
  "precipitation": 395
}, {
  "date": "2017-07-02T03:00:00Z",
  "thunderstorms": 0,
  "fire": 171,
  "wind": 238,
  "precipitation": 407
}, {
  "date": "2017-07-02T06:00:00Z",
  "thunderstorms": 0,
  "fire": 132,
  "wind": 303,
  "precipitation": 414
}, {
  "date": "2017-07-02T09:00:00Z",
  "thunderstorms": 0,
  "fire": 156,
  "wind": 250,
  "precipitation": 369
}, {
  "date": "2017-07-02T12:00:00Z",
  "thunderstorms": 100,
  "fire": 202,
  "wind": 247,
  "precipitation": 386
}, {
  "date": "2017-07-02T15:00:00Z",
  "thunderstorms": 0,
  "fire": 117,
  "wind": 240,
  "precipitation": 408
}, {
  "date": "2017-07-02T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 248,
  "precipitation": 410
}, {
  "date": "2017-07-02T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 319,
  "precipitation": 332
}, {
  "date": "2017-07-03T00:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 227,
  "precipitation": 403
}, {
  "date": "2017-07-03T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 279,
  "precipitation": 347
}, {
  "date": "2017-07-03T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 239,
  "precipitation": 350
}, {
  "date": "2017-07-03T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 315,
  "precipitation": 429
}, {
  "date": "2017-07-03T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 307,
  "precipitation": 394
}, {
  "date": "2017-07-03T15:00:00Z",
  "thunderstorms": 100,
  "fire": 120,
  "wind": 222,
  "precipitation": 428
}, {
  "date": "2017-07-03T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 243,
  "precipitation": 357
}, {
  "date": "2017-07-03T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 221,
  "precipitation": 360
}, {
  "date": "2017-07-04T00:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 297,
  "precipitation": 369
}, {
  "date": "2017-07-04T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 311,
  "precipitation": 359
}, {
  "date": "2017-07-04T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 319,
  "precipitation": 387
}, {
  "date": "2017-07-04T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 262,
  "precipitation": 411
}, {
  "date": "2017-07-04T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 311,
  "precipitation": 394
}, {
  "date": "2017-07-04T15:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 313,
  "precipitation": 403
}, {
  "date": "2017-07-04T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 301,
  "precipitation": 340
}, {
  "date": "2017-07-04T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 278,
  "precipitation": 396
}, {
  "date": "2017-07-05T00:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 233,
  "precipitation": 414
}, {
  "date": "2017-07-05T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 283,
  "precipitation": 350
}, {
  "date": "2017-07-05T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 223,
  "precipitation": 411
}, {
  "date": "2017-07-05T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 294,
  "precipitation": 425
}, {
  "date": "2017-07-05T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 259,
  "precipitation": 342
}, {
  "date": "2017-07-05T15:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 254,
  "precipitation": 404
}, {
  "date": "2017-07-05T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 273,
  "precipitation": 362
}, {
  "date": "2017-07-05T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 227,
  "precipitation": 384
}, {
  "date": "2017-07-06T00:00:00Z",
  "thunderstorms": 100,
  "fire": 120,
  "wind": 224,
  "precipitation": 360
}, {
  "date": "2017-07-06T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 246,
  "precipitation": 343
}, {
  "date": "2017-07-06T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 315,
  "precipitation": 350
}, {
  "date": "2017-07-06T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 287,
  "precipitation": 408
}, {
  "date": "2017-07-06T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 309,
  "precipitation": 380
}, {
  "date": "2017-07-06T15:00:00Z",
  "thunderstorms": 0,
  "fire": 178,
  "wind": 251,
  "precipitation": 384
}, {
  "date": "2017-07-06T18:00:00Z",
  "thunderstorms": 0,
  "fire": 184,
  "wind": 277,
  "precipitation": 425
}, {
  "date": "2017-07-06T21:00:00Z",
  "thunderstorms": 0,
  "fire": 147,
  "wind": 239,
  "precipitation": 392
}, {
  "date": "2017-07-07T00:00:00Z",
  "thunderstorms": 0,
  "fire": 149,
  "wind": 220,
  "precipitation": 340
}, {
  "date": "2017-07-07T03:00:00Z",
  "thunderstorms": 0,
  "fire": 175,
  "wind": 313,
  "precipitation": 418
}, {
  "date": "2017-07-07T06:00:00Z",
  "thunderstorms": 0,
  "fire": 172,
  "wind": 307,
  "precipitation": 348
}, {
  "date": "2017-07-07T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 286,
  "precipitation": 355
}, {
  "date": "2017-07-07T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 229,
  "precipitation": 352
}, {
  "date": "2017-07-07T15:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 318,
  "precipitation": 416
}, {
  "date": "2017-07-07T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 280,
  "precipitation": 349
}, {
  "date": "2017-07-07T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 257,
  "precipitation": 376
}, {
  "date": "2017-07-08T00:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 315,
  "precipitation": 424
}, {
  "date": "2017-07-08T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 264,
  "precipitation": 412
}, {
  "date": "2017-07-08T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 303,
  "precipitation": 349
}, {
  "date": "2017-07-08T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 297,
  "precipitation": 359
}, {
  "date": "2017-07-08T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 314,
  "precipitation": 417
}, {
  "date": "2017-07-08T15:00:00Z",
  "thunderstorms": 100,
  "fire": 120,
  "wind": 262,
  "precipitation": 419
}, {
  "date": "2017-07-08T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 223,
  "precipitation": 340
}, {
  "date": "2017-07-08T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 293,
  "precipitation": 344
}, {
  "date": "2017-07-09T00:00:00Z",
  "thunderstorms": 0,
  "fire": 143,
  "wind": 228,
  "precipitation": 350
}, {
  "date": "2017-07-09T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 273,
  "precipitation": 411
}, {
  "date": "2017-07-09T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 293,
  "precipitation": 414
}, {
  "date": "2017-07-09T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 222,
  "precipitation": 364
}, {
  "date": "2017-07-09T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 254,
  "precipitation": 408
}, {
  "date": "2017-07-09T15:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 246,
  "precipitation": 387
}, {
  "date": "2017-07-09T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 245,
  "precipitation": 387
}, {
  "date": "2017-07-09T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 304,
  "precipitation": 397
}, {
  "date": "2017-07-10T00:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 276,
  "precipitation": 403
}, {
  "date": "2017-07-10T03:00:00Z",
  "thunderstorms": 100,
  "fire": 120,
  "wind": 239,
  "precipitation": 428
}, {
  "date": "2017-07-10T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 317,
  "precipitation": 333
}, {
  "date": "2017-07-10T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 277,
  "precipitation": 381
}, {
  "date": "2017-07-10T12:00:00Z",
  "thunderstorms": 0,
  "fire": 119,
  "wind": 304,
  "precipitation": 352
}, {
  "date": "2017-07-10T15:00:00Z",
  "thunderstorms": 100,
  "fire": 195,
  "wind": 227,
  "precipitation": 402
}, {
  "date": "2017-07-10T18:00:00Z",
  "thunderstorms": 0,
  "fire": 191,
  "wind": 312,
  "precipitation": 384
}, {
  "date": "2017-07-10T21:00:00Z",
  "thunderstorms": 0,
  "fire": 164,
  "wind": 296,
  "precipitation": 412
}, {
  "date": "2017-07-11T00:00:00Z",
  "thunderstorms": 0,
  "fire": 204,
  "wind": 244,
  "precipitation": 388
}, {
  "date": "2017-07-11T03:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 250,
  "precipitation": 339
}, {
  "date": "2017-07-11T06:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 233,
  "precipitation": 366
}, {
  "date": "2017-07-11T09:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 250,
  "precipitation": 406
}, {
  "date": "2017-07-11T12:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 309,
  "precipitation": 409
}, {
  "date": "2017-07-11T15:00:00Z",
  "thunderstorms": 100,
  "fire": 120,
  "wind": 287,
  "precipitation": 385
}, {
  "date": "2017-07-11T18:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 305,
  "precipitation": 423
}, {
  "date": "2017-07-11T21:00:00Z",
  "thunderstorms": 0,
  "fire": 120,
  "wind": 266,
  "precipitation": 369
}];
