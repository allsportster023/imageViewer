/**
 * Created by bslaugh on 7/7/17.
 */

import React from 'react';
import moment from 'moment';
import {LineChart, Line, ReferenceLine, Dot, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';

const CustomizedLabel = React.createClass({
  render () {
    const {x, y, stroke, value} = this.props;

    return (<g className="recharts-reference-line-label">
              <text stroke={stroke} fill="lightgray" x={x} dx={3} y="12" className="recharts-text" textAnchor="right">
                <tspan x={x} dy="0em">{value}</tspan>
              </text>
            </g>)
  }
});


class WeatherObject extends React.Component {

  constructor(props) {
    super(props);

    this.fields = ["Rain", "Wind", "Fires", "T-Storms"];


    this.toggleWeatherField.bind(this);
    this.changeBuffer.bind(this);

    this.state = {
      selectedFields: this.props.fields.slice(),
      imageDates: ["2017-07-06T06:00:00Z", "2017-07-10T06:00:00Z"],
      timeHourBuffer: 12
    }
  }

  componentDidMount() {
    //http://earthserver.ecmwf.int/rasdaman/ows?&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=Rain&SUBSET=Lat(35)&SUBSET=Long(35)&FORMAT=application/json

    $('button#floatMenu').on('click', function (event) {
      $(this).parent().toggleClass("open");
    });
  }


  dateFormat(d) {
    const mt = moment(d).utc();
    return mt.format('MMMM D, HH') + "00Z"
  }

  changeBuffer(e){
    const bufferVal = document.querySelector(e).value;

    this.setState({
      timeHourBuffer: bufferVal
    });

  }

  toggleWeatherField(e){
    const checked = document.querySelector(e).checked;
    const field = e.replace("Switch","").replace("#","");

    //element is in there and it is false (not checked)
    if(!checked){
      const indexToRemove = this.state.selectedFields.indexOf(field);
      this.state.selectedFields.splice(indexToRemove, 1);

    } else {
      this.state.selectedFields.push(field);
    }

    console.log(this.state.selectedFields);

    this.setState ({
      selectedFields: this.state.selectedFields
    });
  }

  render() {

    let colors = {};
    colors["Rain"] = "lightblue";
    colors["Hail"] = "white";
    colors["T-Storms"] = "lightgreen";
    colors["Fires"] = "red";
    colors["Earthquake"] = "#ff30f5";
    colors["Wind"] = "orange";


    let keys = [];

    for (const key of Object.keys(realData[0])) {
      if (key != "date")
        keys.push(key)
    }

    let dates = [];

    for (let i = 0; i < this.props.images.length && this.props.images.length > 0; i++){
      if(this.props.images[i] != null) {
        dates.push(new Date(this.props.images[i].datetime));
      }
    }

    const maxDate = moment(new Date(Math.max.apply(null,dates)));
    const minDate = moment(new Date(Math.min.apply(null,dates)));

    maxDate.add(this.state.timeHourBuffer, 'hours');
    minDate.subtract(this.state.timeHourBuffer, 'hours');

    this.newRealData = [];

    for(let i = 0; i < realData.length; i++) {

      let newDate = realData[i].date;
      newDate = new Date(newDate);

      if(newDate >= minDate && newDate <=maxDate){
        this.newRealData.push(realData[i]);
      }

    }


    const _this = this;

    return (
      <div>
        <table style={{width: "100%", height: "250px"}}>
          <tbody>
          <tr className="chart-stl">
            <td style={{paddingTop: "15px"}} className="chart-label">
              <div id="floatIcon" className="btn-group">
                <button id="floatMenu" type="button" className="btn btn-default dropdown-toggle">
                  <span className="glyphicon glyphicon-menu-hamburger" />
                </button>
                <ul className="dropdown-menu">
                  {this.props.fields.map(function (field) {
                    return (<li key={field} className="list-group-item">
                      {field}
                      <div className="material-switch pull-right">
                        <input id={field+"Switch"} type="checkbox" onClick={ () =>_this.toggleWeatherField("#"+field+"Switch")} defaultChecked/>
                        <label htmlFor={field+"Switch"} className="label-primary" />
                      </div>
                    </li>)
                  })}
                  <li className="list-group-item">
                    Hour Buffer
                    <input id={"BufferValue"} type="text" defaultValue={12} onChange={ () =>_this.changeBuffer("#BufferValue")} style={{width: "50px", float: "right", textAlign: "center"}}/>
                  </li>
                </ul>
              </div>
              <ul className="vertGrp">
              {this.state.selectedFields.map(function (k, idx) {

                //Set the text and the icons for the side legend
                let iconName;
                let iconText = k;
                if(k == "Rain") {
                  iconName = "wi-rain";
                } else if(k == "Wind") {
                  iconName = "wi-strong-wind";
                } else if(k == "Fires") {
                  iconName = "wi-fire";
                } else if(k == "T-Storms") {
                  iconName = "wi-storm-showers";
                  iconText = "Storms"
                }

                return (<li key={idx} className="tableYaxisLabels">
                          {iconText}
                          <i className={"wi "+iconName+" icon-stl"} />
                        </li>)
              })}
              </ul>
            </td>
            <td>
              <ResponsiveContainer>
                <LineChart data={this.newRealData}
                           margin={{top: 0, right: 30, left: -50, bottom: 0}} style={{float: "left"}}>

                  <XAxis dataKey="date" tick={{stroke: 'white'}} tickLine={{stroke: 'white'}} axisLine={{stroke: 'white'}}
                         padding={{left: 0, right: 0}} tickFormatter={this.dateFormat}/>
                  <YAxis axisLine={false} tickLine={false} ticks={this.fields}/>

                  <Tooltip itemSorter={(item1, item2) => 1} wrapperStyle={{color: 'black'}}/>

                  {this.state.selectedFields.map(function (k, idx) {
                    return (
                      <Line key={idx} type='monotone' dataKey={k} stroke={colors[k.charAt(0).toUpperCase() + k.slice(1)]}
                            dot={false}/>)
                  })}

                  {this.props.images.map(function (e, idx) {
                    if(e != null)
                      return (<ReferenceLine key={idx} x={new Date(e.datetime).toISOString().replace(".000","")} label={<CustomizedLabel value={e.id}/>} stroke="lightgray" />);
                  })}

                  <Dot r={0}/>
                </LineChart>
              </ResponsiveContainer>
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
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 239,
  "Rain": 394
}, {
  "date": "2017-07-01T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 233,
  "Rain": 399
}, {
  "date": "2017-07-01T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 260,
  "Rain": 362
}, {
  "date": "2017-07-01T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 257,
  "Rain": 412
}, {
  "date": "2017-07-01T15:00:00Z",
  "T-Storms": 100,
  "Fires": 120,
  "Wind": 272,
  "Rain": 409
}, {
  "date": "2017-07-01T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 276,
  "Rain": 364
}, {
  "date": "2017-07-01T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 291,
  "Rain": 416
}, {
  "date": "2017-07-02T00:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 256,
  "Rain": 395
}, {
  "date": "2017-07-02T03:00:00Z",
  "T-Storms": 0,
  "Fires": 171,
  "Wind": 238,
  "Rain": 407
}, {
  "date": "2017-07-02T06:00:00Z",
  "T-Storms": 0,
  "Fires": 132,
  "Wind": 303,
  "Rain": 414
}, {
  "date": "2017-07-02T09:00:00Z",
  "T-Storms": 0,
  "Fires": 156,
  "Wind": 250,
  "Rain": 369
}, {
  "date": "2017-07-02T12:00:00Z",
  "T-Storms": 100,
  "Fires": 202,
  "Wind": 247,
  "Rain": 386
}, {
  "date": "2017-07-02T15:00:00Z",
  "T-Storms": 0,
  "Fires": 117,
  "Wind": 240,
  "Rain": 408
}, {
  "date": "2017-07-02T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 248,
  "Rain": 410
}, {
  "date": "2017-07-02T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 319,
  "Rain": 332
}, {
  "date": "2017-07-03T00:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 227,
  "Rain": 403
}, {
  "date": "2017-07-03T03:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 279,
  "Rain": 347
}, {
  "date": "2017-07-03T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 239,
  "Rain": 350
}, {
  "date": "2017-07-03T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 315,
  "Rain": 429
}, {
  "date": "2017-07-03T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 307,
  "Rain": 394
}, {
  "date": "2017-07-03T15:00:00Z",
  "T-Storms": 100,
  "Fires": 120,
  "Wind": 222,
  "Rain": 428
}, {
  "date": "2017-07-03T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 243,
  "Rain": 357
}, {
  "date": "2017-07-03T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 221,
  "Rain": 360
}, {
  "date": "2017-07-04T00:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 297,
  "Rain": 369
}, {
  "date": "2017-07-04T03:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 311,
  "Rain": 359
}, {
  "date": "2017-07-04T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 319,
  "Rain": 387
}, {
  "date": "2017-07-04T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 262,
  "Rain": 411
}, {
  "date": "2017-07-04T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 311,
  "Rain": 394
}, {
  "date": "2017-07-04T15:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 313,
  "Rain": 403
}, {
  "date": "2017-07-04T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 301,
  "Rain": 340
}, {
  "date": "2017-07-04T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 278,
  "Rain": 396
}, {
  "date": "2017-07-05T00:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 233,
  "Rain": 414
}, {
  "date": "2017-07-05T03:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 283,
  "Rain": 350
}, {
  "date": "2017-07-05T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 223,
  "Rain": 411
}, {
  "date": "2017-07-05T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 294,
  "Rain": 425
}, {
  "date": "2017-07-05T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 259,
  "Rain": 342
}, {
  "date": "2017-07-05T15:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 254,
  "Rain": 404
}, {
  "date": "2017-07-05T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 273,
  "Rain": 362
}, {
  "date": "2017-07-05T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 227,
  "Rain": 384
}, {
  "date": "2017-07-06T00:00:00Z",
  "T-Storms": 100,
  "Fires": 120,
  "Wind": 224,
  "Rain": 360
}, {
  "date": "2017-07-06T03:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 246,
  "Rain": 343
}, {
  "date": "2017-07-06T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 315,
  "Rain": 350
}, {
  "date": "2017-07-06T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 287,
  "Rain": 408
}, {
  "date": "2017-07-06T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 309,
  "Rain": 380
}, {
  "date": "2017-07-06T15:00:00Z",
  "T-Storms": 0,
  "Fires": 178,
  "Wind": 251,
  "Rain": 384
}, {
  "date": "2017-07-06T18:00:00Z",
  "T-Storms": 0,
  "Fires": 184,
  "Wind": 277,
  "Rain": 425
}, {
  "date": "2017-07-06T21:00:00Z",
  "T-Storms": 0,
  "Fires": 147,
  "Wind": 239,
  "Rain": 392
}, {
  "date": "2017-07-07T00:00:00Z",
  "T-Storms": 0,
  "Fires": 149,
  "Wind": 220,
  "Rain": 340
}, {
  "date": "2017-07-07T03:00:00Z",
  "T-Storms": 0,
  "Fires": 175,
  "Wind": 313,
  "Rain": 418
}, {
  "date": "2017-07-07T06:00:00Z",
  "T-Storms": 0,
  "Fires": 172,
  "Wind": 307,
  "Rain": 348
}, {
  "date": "2017-07-07T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 286,
  "Rain": 355
}, {
  "date": "2017-07-07T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 229,
  "Rain": 352
}, {
  "date": "2017-07-07T15:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 318,
  "Rain": 416
}, {
  "date": "2017-07-07T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 280,
  "Rain": 349
}, {
  "date": "2017-07-07T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 257,
  "Rain": 376
}, {
  "date": "2017-07-08T00:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 315,
  "Rain": 424
}, {
  "date": "2017-07-08T03:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 264,
  "Rain": 412
}, {
  "date": "2017-07-08T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 303,
  "Rain": 349
}, {
  "date": "2017-07-08T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 297,
  "Rain": 359
}, {
  "date": "2017-07-08T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 314,
  "Rain": 417
}, {
  "date": "2017-07-08T15:00:00Z",
  "T-Storms": 100,
  "Fires": 120,
  "Wind": 262,
  "Rain": 419
}, {
  "date": "2017-07-08T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 223,
  "Rain": 340
}, {
  "date": "2017-07-08T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 293,
  "Rain": 344
}, {
  "date": "2017-07-09T00:00:00Z",
  "T-Storms": 0,
  "Fires": 143,
  "Wind": 228,
  "Rain": 350
}, {
  "date": "2017-07-09T03:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 273,
  "Rain": 411
}, {
  "date": "2017-07-09T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 293,
  "Rain": 414
}, {
  "date": "2017-07-09T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 222,
  "Rain": 364
}, {
  "date": "2017-07-09T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 254,
  "Rain": 408
}, {
  "date": "2017-07-09T15:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 246,
  "Rain": 387
}, {
  "date": "2017-07-09T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 245,
  "Rain": 387
}, {
  "date": "2017-07-09T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 304,
  "Rain": 397
}, {
  "date": "2017-07-10T00:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 276,
  "Rain": 403
}, {
  "date": "2017-07-10T03:00:00Z",
  "T-Storms": 100,
  "Fires": 120,
  "Wind": 239,
  "Rain": 428
}, {
  "date": "2017-07-10T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 317,
  "Rain": 333
}, {
  "date": "2017-07-10T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 277,
  "Rain": 381
}, {
  "date": "2017-07-10T12:00:00Z",
  "T-Storms": 0,
  "Fires": 119,
  "Wind": 304,
  "Rain": 352
}, {
  "date": "2017-07-10T15:00:00Z",
  "T-Storms": 100,
  "Fires": 195,
  "Wind": 227,
  "Rain": 402
}, {
  "date": "2017-07-10T18:00:00Z",
  "T-Storms": 0,
  "Fires": 191,
  "Wind": 312,
  "Rain": 384
}, {
  "date": "2017-07-10T21:00:00Z",
  "T-Storms": 0,
  "Fires": 164,
  "Wind": 296,
  "Rain": 412
}, {
  "date": "2017-07-11T00:00:00Z",
  "T-Storms": 0,
  "Fires": 204,
  "Wind": 244,
  "Rain": 388
}, {
  "date": "2017-07-11T03:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 250,
  "Rain": 339
}, {
  "date": "2017-07-11T06:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 233,
  "Rain": 366
}, {
  "date": "2017-07-11T09:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 250,
  "Rain": 406
}, {
  "date": "2017-07-11T12:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 309,
  "Rain": 409
}, {
  "date": "2017-07-11T15:00:00Z",
  "T-Storms": 100,
  "Fires": 120,
  "Wind": 287,
  "Rain": 385
}, {
  "date": "2017-07-11T18:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 305,
  "Rain": 423
}, {
  "date": "2017-07-11T21:00:00Z",
  "T-Storms": 0,
  "Fires": 120,
  "Wind": 266,
  "Rain": 369
}];
