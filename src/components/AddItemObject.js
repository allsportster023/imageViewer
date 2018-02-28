/**
 * Created by bslaugh on 7/9/17.
 */

import React from 'react';
import '../styles/main.css';
import plusSign from '../images/green-plus-sign.png';

class AddItemObject extends React.Component {

  render() {

    return (
      <div id="addItemDiv" className="noselect" onClick={this.props.addAction} >
        <span className="helper noselect" />
        <img src={plusSign} width="100%" alt={"Click here to add images"}/>
      </div>
    )}
}

export default AddItemObject
