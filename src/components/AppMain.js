import React from 'react';
import ImageObject from './ImageObject';
import AddItemObject from './AddItemObject';
import WeatherObject from './WeatherObject';

class AppMain extends React.Component {

  constructor(props) {
    super(props);

    this.availableWeatherParams = ["Rain", "Wind", "Fires", "T-Storms"];

    this.state = {
      boxCount: 1,
      images: [null]
    };
  }

  addImageData(img, index){

    if(this.state.images[index] != img) {
      this.state.images[index] = img;

      console.log(this.state.images);

      this.setState({image: this.state.images});

    }
  }

  addItem() {

    const nextBoxCount = this.state.boxCount + 1;

    if (nextBoxCount < 7) {

      this.state.boxCount++;
      this.state.images.push(null);

      this.setState({boxCount: this.state.boxCount, images: this.state.images});
    }
  }

  removeImage(data, index){

    if (index > -1 && this.state.boxCount > 1) {
      console.log("Removing Index: "+index);
      this.state.images.splice(index, 1);
      this.state.boxCount = this.state.boxCount-1;
      console.log(this.state.images);

      this.setState({boxCount: this.state.boxCount, images: this.state.images});
    }

  }

  render() {

    // console.log(this.state.images);
    const _this = this;
    let items = [];
    const neededWidth = 100.0/this.state.boxCount;
    this.state.images.map(function (img, i) {
      console.log(img);
      items.push(<td key={i} style={{width: neededWidth+"%"}}><ImageObject index={i} appImgCount={_this.state.images.length} imageData={img}
                                          addImage={_this.addImageData.bind(_this)} removeImage={_this.removeImage.bind(_this)}/></td>)
    });

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <div className="row">
                <table id="imagesTable">
                  <tbody>
                  <tr>
                    { items }
                  </tr>
                  </tbody>
                </table>
              </div>
              <div className="row">
                <WeatherObject fields={this.availableWeatherParams} images={this.state.images} />
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
