import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import '../styles/main.css';


class CustomTooltip extends React.Component {


    render() {

        const {active} = this.props;
        if (active) {
            const {payload, label} = this.props;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label"><b>{moment(label).utc().format('MMMM D, HH') + "00Z"}</b></p>

                    {payload.map(function (d, idx) {
                        return (<p key={idx} className={"tooltip-entry" + d.dataKey+ "Color"}><b>{d.dataKey + ": " +
                        (Math.round(d.payload["orig" + d.dataKey] * 100) / 100) +
                        d.payload[d.dataKey + "Units "]}</b></p>)
                    })}

                </div>
            );
        }
        return null;
    }
}

CustomTooltip.propTypes = {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.number
};

export default CustomTooltip;