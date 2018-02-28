import React from 'react';
import '../styles/main.css';


class WeatherDropdown extends React.Component {

    render() {

        const _this = this;

        return (
            <div className="dropdownButton dropup">
                <button id="floatMenu" className={"btn btn-sm dropdown-toggle"} type="button" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-menu-hamburger"/>
                </button>
                <ul className="dropdown-menu">
                    {this.props.fields.map(function (field, idx) {
                        return (<li key={field} className="list-group-item">
                            {field}
                            <div className="material-switch pull-right">
                                <input id={field + "Switch"} type="checkbox"
                                       onClick={() => _this.props.toggleWeatherField("#" + field + "Switch")}
                                       checked={_this.props.selectedFields.indexOf(field) >= 0}
                                       readOnly={true}/>
                                <label htmlFor={field + "Switch"} className="label-primary"/>
                            </div>
                        </li>)
                    })}
                    <li className="list-group-item">
                        Hour Buffer
                        <input id={"BufferValue"} type="text" defaultValue={3}
                               onChange={() => this.props.changeBuffer("#BufferValue")}
                               style={{width: "50px", float: "right", textAlign: "center"}}/>
                    </li>
                </ul>
            </div>
        );
    }
}

export default WeatherDropdown
