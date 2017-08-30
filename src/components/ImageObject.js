/**
 * Created by bslaugh on 7/7/17.
 */

import React from 'react';

class ImageObject extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      image: null,
      typedImageId: null
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.imageData != this.props.imageData){
      if(nextProps.imageData != null)
        this.setState({image: nextProps.imageData, typedImageId: nextProps.imageData.id});
    }
  }

  searchForImage() {

    console.log(this.state.typedImageId);

    this.props.addImage(data[this.state.typedImageId], this.props.index);
    this.setState({image: data[this.state.typedImageId]});

  }

  handleInputTyping(e) {
    this.setState({typedImageId: e.target.value});
  }

  handleKeyDown(evt) {
    if (evt.keyCode == 13 ) {
      this.searchForImage();
    }
}

  render() {

    let imageAlreadyLoaded = true;

    try{
      const dateTime = this.state.image.datetime;
    } catch(e) {
      imageAlreadyLoaded = false;
    }

    return (
      <div id="mainImageObject" className="container-fluid box-style">
        <div style={{float: "right", marginRight: "-27px", marginTop: "-12px"}}>
          <img id="closeButton" src="../../images/red_x.png" width={16 - (this.props.appImgCount - 8) + "px"}
               onClick={ () => this.props.removeImage(this.state.image, this.props.index)}/>
        </div>
        <div className="row srch-row" style={{marginTop: "15px"}}>
          <span className="srch-hdr" style={{marginBottom: "5px"}}>
            <div className="srch-hdr">
              <b>Image:</b>
            </div>
          </span>
          <input type="text" style={{color: "black"}} onChange={this.handleInputTyping.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} value={(this.state.typedImageId ? this.state.typedImageId : "")}/>
          <br />
          <button type="button" style={{marginTop: "5px"}} className="btn btn-info"
                  onClick={this.searchForImage.bind(this)} >Search
          </button>
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
                  <span className="glyphicon glyphicon-calendar icon-stl" aria-hidden="true"/>
                  Date
                </td>
                <td>{ imageAlreadyLoaded ? this.state.image.datetime : ""}</td>
              </tr>
              <tr>
                <td>
                  <span className="glyphicon glyphicon-map-marker icon-stl" aria-hidden="true"/>
                  Location
                </td>
                <td>
                  { imageAlreadyLoaded ? this.state.image.location : ""}
                </td>
              </tr>
              <tr>
                <td>
                  <span className="glyphicon glyphicon-star-empty icon-stl" aria-hidden="true"/>
                  Source
                </td>
                <td>{ imageAlreadyLoaded ? this.state.image.source : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <a href={"#myLargeModalLabel" + this.props.index} data-toggle="modal"
             data-target={".bs-example-modal-lg" + this.props.index}>
            <img className="image-style" src="../../images/bwPic.jpg"
                 width={this.props.appImgCount > 4 ? "92%" : "300px"}/>
          </a>
          {/*TODO: Use a blank picture for no picture added*/}
          <div className={"modal fade bs-example-modal-lg" + this.props.index} role="dialog"
               aria-labelledby={"myLargeModalLabel" + this.props.index}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <img src="../../images/bwPic.jpg" width="100%"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default ImageObject
