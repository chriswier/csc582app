import React from 'react';

class ChangeBar extends React.Component {
  constructor(props) {
    super(props);
 
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  // handlers
  handleSubmit(event) {
    event.preventDefault();
    this.props.onChangeBarSubmit();
  }

  handleUserChange(event) {
    this.props.onUserChange(event.target.value);
  }

  handleItemChange(event) {
    this.props.onItemChange(event.target.value);
  }

  handleQuantityChange(event) {
    this.props.onQuantityChange(event.target.value);
  }

  render() {

    // deal with empty initial state
    if(this.props.initial === 1) {
      return(<p>&nbsp;</p>);
    }

    // variables
    const users = this.props.users;
    const inventory = this.props.inventory;
    const state = this.props.state;
    const changeuser = state.changeuser;
    const changeitem = state.changeitem;
    const changequantity = state.changequantity;

    // map a select options list of users and inventory
    const myUsers = users.map((usr) => {
      let keyval = "user" + usr[0];
      return(<option value={usr[0]} key={keyval}>{usr[1]}</option>);
    });
    const myInventory = inventory.map((ivn) => {
      let keyval = "inventory" + ivn[0];
      return(<option value={ivn[0]} key={keyval}>{ivn[1]}</option>);
    });

    return (
      <form onSubmit={this.handleSubmit}>
        <span className="searchSpan">Inventory Change: &nbsp; &nbsp;
          <select value={changeuser} name="user" onChange={this.handleUserChange}>{myUsers}</select> &nbsp;
          <select value={changeitem} name="item" onChange={this.handleItemChange}>{myInventory}</select> &nbsp;
          Used Quantity: <input type="text" name="qty" value={changequantity} onChange={this.handleQuantityChange}/> &nbsp;
          <input type="submit" value="Submit" />
        </span>
      </form>
    );
  }
}

// Export it
export default ChangeBar
