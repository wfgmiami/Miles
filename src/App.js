import React, { Component } from 'react';
//import InputComponent from './InputComponent';
import MapElement from './MapElement';

class App extends Component {
  constructor(){
    super();
    this.state = {}
  }

  componentDidMount(){
	
  }

  render(){
    const map_key = process.env.MAP_KEY;

    return (
      <div className="container">
        <div className="well">
          IFTA MILEAGE BY STATE
        </div>
		<MapElement />
	 </div>
    )
  }
}

export default App;
