/**
 * Created by bslaugh on 7/7/17.
 */

import React from 'react';

class ImageObject extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(nextProps, nextState) {

  }

  render() {

    return (
      <div id="mainImageObject" className="container-fluid box-style">
        <div className="row srch-row" style={{marginTop: "15px"}}>
          <span className="srch-hdr"style={{marginBottom: "5px"}}>
            <div className="srch-hdr">
              <b>Image:</b>
            </div>
          </span>
          <input type="text" />
          <br />
          <button type="button" style={{marginTop: "5px"}} className="btn btn-info">Search</button>
        </div>
        <div className="row" style={{marginTop: "15px"}}>
          <table className="table table-hover table-condensed tableCenter" style={{width: "85%"}}>
            <thead className="tableHead">
            <tr>
              <th>Field</th>
              <th>Data</th>
            </tr>
            </thead>
            <tbody className="tableBody">
            <tr>
              <td>
                <span className="glyphicon glyphicon-calendar icon-stl" aria-hidden="true"></span>
                Date
              </td>
              <td>2017-07-{this.props.index < 2 ? "0" : "" }{2+(this.props.index*4)}</td>
            </tr>
            <tr>
              <td>
                <span className="glyphicon glyphicon-map-marker icon-stl" aria-hidden="true"></span>
                Location
              </td>
              <td>
                Location_{this.props.index+1}
              </td>
            </tr>
            <tr>
              <td>
                <span className="glyphicon glyphicon-star-empty icon-stl" aria-hidden="true"></span>
                Source
              </td>
              <td>Source_{this.props.index+1}</td>
            </tr>
            {/*{this.state.data.map(function (d, idx) {*/}
            {/*return <tr key={idx}>*/}
            {/*<td>{d.Date}</td>*/}
            {/*<td>{d.Source}</td>*/}
            {/*<td>{d.Category}</td>*/}
            {/*<td>{d.Code}</td>*/}
            {/*<td>{d.Location}</td>*/}
            {/*</tr>;*/}
            {/*})}*/}
            </tbody>
          </table>
        </div>
        <div className="row">
          <a href={"#myLargeModalLabel"+this.props.index} data-toggle="modal" data-target={".bs-example-modal-lg"+this.props.index}>
            <img className="image-style" src="../../images/bwPic.jpg" width={this.props.appImgCount > 4 ? "85%" : "250px"} />
          </a>
          {/*TODO: Use a blank picture for no picture added*/}
          <div className={"modal fade bs-example-modal-lg"+this.props.index} role="dialog" aria-labelledby={"myLargeModalLabel"+this.props.index}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <img src="../../images/bwPic.jpg" width="100%" />
              </div>
            </div>
          </div>

        </div>
      </div>
    )}
}

export default ImageObject
