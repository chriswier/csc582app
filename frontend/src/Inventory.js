import React from 'react';

function InventoryEntry(props) {
 
  //console.log("props",props); 
  // variables
  //let invid = props.data[0];
  let name = props.data[1];
  let quantity = props.data[2];

  return(
    <div className="inventoryitems">
      <span>{name}</span>
      <span>{quantity}</span>   
    </div>
  );
}

class Inventory extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }

  render() {

    // get my data
    const data = this.props.data;
    console.log("data is:",data);
    console.log("inventory length:",data.length);

    // css
    const h2css = {
      marginBottom: '2px'
    }

    // render each element in the inventory data hash
    const myInventory = data.map((dat) => {
      //console.log("dat:",dat);
      return(<InventoryEntry data={dat} key={dat[0]} />);
    });

    // temp
    return (
      <div>
      <h2 style={h2css}>Master Inventory List</h2>
      <div className="inventory"><span>Item</span> <span>Quantity</span></div><br />
      {myInventory}
      </div>
    );

  }
}

// Export it
export default Inventory
