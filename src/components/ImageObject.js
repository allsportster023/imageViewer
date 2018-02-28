/**
 * Created by bslaugh on 7/7/17.
 */

import React from 'react';
import axios from 'axios';
import moment from 'moment';
import emptyImage from "../images/empty.png";
import redX from "../images/red_x.png";
import '../styles/main.css';


class ImageObject extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            image: null,
            typedImageId: null,
            loading: false,
            error: null
        };

        this.fakeData = {
            type: "Feature",
            id: "123456789",
            geometry: {
                type: "Polygon",
                coordinates: [[1, 2], [3, 4]]
            },
            properties: {
                ID: "123456789",
                DATE_IMAGE: "2017-07-06T00:00:00Z",
                DATE_MODIFIED: "2018-01-01T12:34:56Z",
                IMAGE_SENSOR: "DSLR",
                TOT: "0100",
                bbox: [1, 20, 2, 22]
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageData !== this.state.image) {
            if (nextProps.imageData !== null)
                this.setState({image: nextProps.imageData});
        }
    }

    searchForImage() {

        console.log(this.state.typedImageId);

        // const imageUrl = "http://someurl/cedalion/json?id=" + escape(this.state.typedImageId);
        //TODO USING FAKE DATA (delete for real stuff)
        const imageUrl = "https://httpbin.org/delay/1";

//// THIS URL IS FOR WHEN CEDALION WORKS

        console.log(imageUrl);

        const _this = this;
        let error = null;
        this.setState({loading: true, error: null}, () => {
            axios.get(imageUrl)
                .then(function (d) {

                    //TODO USING FAKE DATA (delete for real stuff)
                    d.data = [];

                    if(+_this.state.typedImageId === 1 )
                        d.data[0] = _this.fakeData;

                    if(+_this.state.typedImageId === 2)
                        d.data[1] = _this.fakeData;

                    if (d.data.length === 1) {

                        let useDate = d.data[0].properties.DATE_IMAGE;
                        let useTime = d.data[0].properties.TOT;

                        let justTime = moment(useTime, 'HHmm');
                        let useMoment = moment(useDate).utc();

                        useMoment.set({'hour': justTime.hours(), 'minute': justTime.minutes()});

                        useDate = useMoment.format();

                        const imageData = {
                            id: d.data[0].properties.ID,
                            datetime: useDate,
                            location: d.data[0].properties.bbox,
                            source: d.data[0].properties.IMAGE_SENSOR
                        };

                        console.log(imageData);

                        _this.props.addImage(imageData, _this.props.index);


                    } else if (d.data.length > 1) {
                        error = "More than one record found. Tell Ben (benjamin.a.slaughter@coe.ic.gov) and note the ImageID";
                        console.log(error);

                    } else if (d.data.length === 0) {
                        error = "No image was found for the given ImageID: " + _this.state.typedImageId;
                        console.log(error);
                    }
                    //Set the loading state to false to reset
                    _this.setState({loading: false, error: error});

                })
                .catch(function (error) {
                    console.log(error);
                    error = "ERROR: Could not retrieve image using URL: " + imageUrl +". Tell Ben (benjamin.a.slaughter@coe.ic.gov) and note the URL";
                    _this.setState({loading: false, error: error});
                });
        });
    }


    handleInputTyping(e) {
        this.setState({typedImageId: e.target.value});
    }

    handleKeyDown(evt) {
        if (evt.keyCode === 13) {
            this.searchForImage();
        }
    }

    render() {

        console.log("Rendering ImageObject with data:");
        console.log(this.state.image);

        let imageAlreadyLoaded = true;
        let realLocation = "";

        if(this.state.image === null) {
            imageAlreadyLoaded = false;
        }

        let currImgPath = emptyImage;

        if (imageAlreadyLoaded) {
            currImgPath = "http://someImageLocation/thumbnails.php?id=" + this.state.image.id;

            //TODO UNDO THIS FOR OPS
            currImgPath = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/PM5544_with_non-PAL_signals.png/384px-PM5544_with_non-PAL_signals.png";

            console.log("Loading custom image");

            let diffLat = (Math.abs(this.state.image.location[0] -
                this.state.image.location[2]) / 2) +
                Math.min(this.state.image.location[0], this.state.image.location[2]);

            let diffLon = (Math.abs(this.state.image.location[1] -
                this.state.image.location[3]) / 2) +
                Math.min(this.state.image.location[1], this.state.image.location[3]);

            realLocation = diffLat.toFixed(5) + "/ " + diffLon.toFixed(5);

            console.log("Completed loading custom image");

        }

        return (
            <div style={{position: "relative"}}>
                <div id="mainImageObject" className={"container-fluid box-style " + (this.state.loading ? "overlay" : "")}>
                    <div style={{float: "right", marginRight: "-27px", marginTop: "-12px"}}>
                        <img id="closeButton" src={redX} width={16 - (this.props.appImgCount - 8) + "px"}
                             onClick={() => this.props.removeImage(this.state.image, this.props.index)}
                             alt={"CloseButton"}/>
                    </div>
                    <div className="row srch-row" style={{marginTop: "15px"}}>
                        <span className="srch-hdr" style={{marginBottom: "5px"}}>
                            <div className="srch-hdr">
                              <b>Image:</b>
                            </div>
                        </span>
                        <input type="text" style={{color: "black", width: "50%"}}
                               onChange={this.handleInputTyping.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}
                               value={(this.state.typedImageId ? this.state.typedImageId : "")}/>
                        <br/>
                        {!this.state.error ? "" : (<div className={"errorMessage"}>
                            {this.state.error}</div>)}
                        <button type="button" style={{marginTop: "5px"}} className="btn btn-info"
                                onClick={this.searchForImage.bind(this)}>Search
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
                                <td>{imageAlreadyLoaded ? this.state.image.datetime : ""}</td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="glyphicon glyphicon-map-marker icon-stl" aria-hidden="true"/>
                                    Location
                                </td>
                                <td>
                                    {imageAlreadyLoaded ? realLocation : ""}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="glyphicon glyphicon-star-empty icon-stl" aria-hidden="true"/>
                                    Source
                                </td>
                                <td>{imageAlreadyLoaded ? this.state.image.source : ""}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <a href={"#myLargeModalLabel" + this.props.index} data-toggle="modal"
                           data-target={".bs-example-modal-lg" + this.props.index}>
                            <img className="image-style" src={currImgPath} height={"180"} alt={emptyImage}/>
                        </a>
                        {/*TODO: Use a blank picture for no picture added*/}
                        <div className={"modal fade bs-example-modal-lg" + this.props.index} role="dialog"
                             aria-labelledby={"myLargeModalLabel" + this.props.index}>
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <img src={currImgPath} width="100%" alt={emptyImage}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {!this.state.loading ? "" : (<div className={"over"}>
                    <div className="spinner" style={{margin: "170px auto"}}>
                    <div className="cube1"></div>
                    <div className="cube2"></div>
                </div></div>)}
            </div>
        )

    }
}

export default ImageObject