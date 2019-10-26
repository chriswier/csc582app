import React from 'react';
import logo from './CSIS.Stamp.Vert.eps200x200.jpg';
import './index.css';

// global vars
var host = '141.216.24.220';

class App extends Component {

  constructor(props) {
    super(props);

    // initialize the state
    this.state = {
      inventory: [],
      usage: [],
      message: ' ',
    };
  }

  // when the component mounts, first thing it does is fetch all existing data
  // in our db.  after that we put in polling logic to see if the db has changed
  // and update our UI
  componentDidMount() { }

  // kill processes when we are done with it
  componentWillUnmount() { }

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
        <div class="headerBanner">
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
          <Inventory data={this.state.inventory} />
          <hr />
          <Usage data={this.state.usage} />
        </div>
      </div>
    );
}

export default App;