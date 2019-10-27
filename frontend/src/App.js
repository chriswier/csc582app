import React, { Component } from 'react';
import Inventory from './Inventory.js';
import Usage from './Usage.js';
import ChangeBar from './ChangeBar.js';
import logo from './CSIS.Stamp.Vert.eps200x200.jpg';
import './index.css';

// global vars
var host = '141.216.24.220';

class App extends Component {

  constructor(props) {
    super(props);

    this.onChangeBarSubmit = this.onChangeBarSubmit.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onQuantityChange = this.onQuantityChange.bind(this);

    // initialize the state
    this.state = {
      users: [],
      inventory: [],
      usage: [],
      message: ' ',
      errorstate: 0,
      intervalIsSet: false,
      initial: 1,
      changeuser: 1,
      changeitem: 1,
      changequantity: 0,
    };
  }

  // when the component mounts, first thing it does is fetch all existing data
  // in our db.  after that we put in polling logic to see if the db has changed
  // and update our UI
  componentDidMount() { 


    // first, fetch the the users info one time
    fetch('http://' + host + ':4001/api/users', {
      method: 'GET',
      mode: 'cors',
    })
    .then((data) => data.json())
    .then((res) => this.setState({ users: res }));

    // load all data initially
    this.getDataFromDb();

    // set auto refresh of data
    if(!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // kill processes when we are done with it
  componentWillUnmount() { 
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // method to query the backend for inventory and usage history
  getDataFromDb = () => {

    // first, fetch the inventory info
    fetch('http://' + host + ':4001/api/inventory', {
      method: 'GET',
      mode: 'cors',
    })
    .then((data) => data.json())
    .then((res) => this.setState({ inventory: res }));

    // second, fetch the usage log info
    fetch('http://' + host + ':4001/api/usage', {
      method: 'GET',
      mode: 'cors',
    })
    .then((data) => data.json())
    .then((res) => this.setState({ usage: res }));

    // after an initial load, set the initial to 0
    this.setState({ initial: 0 });
  }

  // handle all form changes; update state
  onChangeBarSubmit(e) {
    console.log("Change bar submit:",this.state);
    this.setState({ message: " ", errorstate: 0 });

    // check to make sure quantity is a number
    if(!(Number.isInteger(parseInt(this.state.changequantity)))) {
      this.setState({ message: "Non-integer quantity!", errorstate: 1 });
      console.log("Non-integer quantity",this.state.changequantity);
      return;
    }

    if(parseInt(this.state.changequantity) === 0) {
      this.setState({ message: "Non-zero quantity required!", errorstate: 1 });
      return;
    }

    // temp variables
    let resultmessage = "";
    let resulterrorstate = 0;

    // create the data I'm uploading to the backend
    let uploaddata = {
      userid: parseInt(this.state.changeuser),
      invid: parseInt(this.state.changeitem),
      quantity: parseInt(this.state.changequantity),
    };

    // upload it
    fetch('http://' + host + ':4001/api/inventoryChange', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploaddata),
    })
    .then((data) => data.json())
    .then(function(res) {
      console.log("submit res",res);
      resultmessage = res.message;
      resulterrorstate = res.errorstate;
    });
    
    this.setState({ message: resultmessage, errorstate: resulterrorstate });
  }

  onUserChange(value) {
    this.setState({ changeuser: parseInt(value) });
    //console.log("onUserChange:",this.state);
  }
  onItemChange(value) {
    this.setState({ changeitem: parseInt(value) });
    //console.log("onItemChange:",this.state);
  }
  onQuantityChange(value) {
    this.setState({ changequantity: value });
    //console.log("onQuantityChange:",this.state);
  }

  // deal with the page render
  render() {

    // css declarations
    const logoFloatLeft = {
      float: 'left',
      backgroundColor: 'white',
      padding: 5,
      margin: 5,
      marginRight: 10,
      marginTop: 8,
      marginLeft: 8,
    }

    const spanbold = {
      fontWeight: 'bold',
      fontSize: 26,
      paddingTop: 10,
    }

    return (
      <div>
        <div style={{ float: 'left' }}>
          <img src={logo} style={logoFloatLeft} alt="UMFlint CSIS Logo" />
        </div>
        <div className="headerBanner">
          <span style={spanbold}>CSC582 Homework Example Inventory App &nbsp; <a href="https://github.com/chriswier/csc582app" target="_blank" rel="noopener noreferrer">(Github)</a></span><br />
          Chris Wieringa cwiering@umich.edu<br />
          Fall 2019 Semester<br />
          Professor: Dr. Halil Bisgin<br /><br />
          Provides a simple example inventory application.  Application is pre-populated with inventory numbers, and users can add / withdraw from it.  All inventory must not be non-negative, which provides a bounds for a failing update to meet homework objectives for rollbacks.
          </div>
        <div style={{padding: 5}}>
        {this.state.message}
        </div>
        <div>
          <ChangeBar initial={this.state.initial} users={this.state.users} inventory={this.state.inventory} state={this.state} onUserChange={this.onUserChange} onItemChange={this.onItemChange} onQuantityChange={this.onQuantityChange} onChangeBarSubmit={this.onChangeBarSubmit} />
          <Inventory initial={this.state.initial} data={this.state.inventory} />
          <Usage initial={this.state.initial} data={this.state.usage} users={this.state.users} inventory={this.state.inventory} />
        </div>
      </div>
    );
  }
}

export default App;
