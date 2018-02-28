import React from 'react';
import ImageObject from './ImageObject';
import AddItemObject from './AddItemObject';
import WeatherObject from './WeatherObject';
import '../styles/main.css';


class AppMain extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            boxCount: 1,
            images: [null]
        };

    }

    //When an image is found, add it to the list
    //  of images that we currently have
    addImageData(img, index) {

        let images = this.state.images.concat([]);

        if (this.state.images[index] !== img) {
            images[index] = img;

            console.log(img);

            this.setState({images: images});

        }
    }

    //Add a null image object to the app when
    //  the user presses the PLUS button
    addItem() {

        const nextBoxCount = this.state.boxCount + 1;

        //Only allow a given number of image objects to be
        // added to the app
        if (nextBoxCount < 7) {

            //Add a null image to the image list
            this.setState({boxCount: this.state.boxCount + 1, images: this.state.images.concat([null])});

        }
    }

    //Remove the image and the component when a user clicks
    //  the red X in the image component
    removeImage(data, index) {

        let images = this.state.images.concat([]);

        //Only remove if we have more than one image object and that the
        //  given index is valid
        if (index > -1 && this.state.boxCount > 1) {
            console.log("Removing Index: " + index);
            images.splice(index, 1);

            this.setState({boxCount: this.state.boxCount - 1, images: images});
        }

    }

    render() {

        // console.log(this.state.images);
        let imageObjects = [];
        const neededWidth = 100.0 / this.state.boxCount;

        const images = this.state.images.concat([]);

        //Create an ImageObject for every image that we have
        for (let i = 0; i < this.state.images.length; i++) {
            imageObjects.push(
                <td key={i} style={{width: neededWidth + "%"}}>
                    <ImageObject index={i}
                                 appImgCount={images.length}
                                 imageData={images[i]}
                                 addImage={this.addImageData.bind(this)}
                                 removeImage={this.removeImage.bind(this)}/>
                </td>)
        }

        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                            <div className="row">
                                <table id="imagesTable">
                                    <tbody>
                                    <tr>
                                        {imageObjects}
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row">
                                <WeatherObject images={images}/>
                            </div>
                        </div>
                        <div className="col-md-1 nopad">
                            <AddItemObject addAction={this.addItem.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AppMain
