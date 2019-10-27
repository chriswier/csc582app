import React from 'react';

function UsageEntry(props) {

  // variables
  const data = props.data;
  const users = props.users;
  const inventory = props.inventory;
  let userid = data[1];
  let invid = data[2];
  let quantity = data[3];
  let timelog = data[4];

  let item = "";
  if(typeof inventory !== 'undefined' && inventory != null && 
     Array.isArray(inventory) && Array.isArray(inventory[invid-1])) {
    item = inventory[invid-1][1];
  }

  let user = "";
  if(typeof users !== 'undefined' && users != null &&
     Array.isArray(users) && Array.isArray(users[userid-1])) {
    user = users[userid-1][1];
  }

  return(
    <div className="inventoryitems">
      <span>{timelog}</span>
      <span>{user}</span>   
      <span>{item}</span>   
      <span>{quantity}</span>   
    </div>
  );
}

class Usage extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }

  render() {

    // deal with empty initial state
    if(this.props.initial === 1) {
      return(<p>&nbsp;</p>);
    }

    // get data
    const data = this.props.data;
    const users = this.props.users;
    const inventory = this.props.inventory;
   
    // render each element in the queue log
    const myLog = data.map((dat) => {
      return(<UsageEntry data={dat} users={users} inventory={inventory} key={dat[0]} />);
    }); 

    // temp
    return (
      <div>
        <h2 className="h2css">Usage Log:</h2>
        <div className="inventory"><span>Date</span> <span>User</span> <span>Item</span> <span>Quantity</span></div><br />
        {myLog}
      </div>
    );

  }
}

// Export it
export default Usage
