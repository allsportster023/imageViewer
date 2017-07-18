/**
 * Created by bslaugh on 7/9/17.
 */

import React from 'react';

class AddItemObject extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div id="addItemDiv" onClick={this.props.addAction} >
        <span className="helper" />
        <img src="../../images/green-plus-sign.png" width="100px"/>
      </div>
    )}
}

export default AddItemObject
