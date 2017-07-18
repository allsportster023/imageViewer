import React from 'react';
import ImageObject from './ImageObject';
import AddItemObject from './AddItemObject';
import WeatherObject from './WeatherObject';

class AppMain extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      boxCount: 1,
      images: []
    }
  }

  componentDidUpdate(nextProps, nextState) {
    console.log("AppMain: Component Did Update");
  }

  addItem() {
    if (this.state.boxCount++ < 7)
      this.setState({boxCount: this.state.boxCount});
  }

  render() {

    let items = [];

    for (let i = 0; i < this.state.boxCount; i++) {
      items.push(<td key={i}><ImageObject index={i} appImgCount={this.state.boxCount}/></td>)
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
                      { items }
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row">
                <WeatherObject maxDate="2017-07-10" minDate="2017-07-05"/>
              </div>
            </div>
            <div className="col-md-1">
              <AddItemObject addAction={this.addItem.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AppMain
