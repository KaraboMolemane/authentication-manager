import React from 'react';
import { Form, Item, Label } from 'devextreme-react/form';

import DepartmentSelectBox from './DepartmentSelectBox.js';
import OrderHistory from './OrderHistory.js';

class DeptRepo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenProductId: null,
    };
    this.productChanged = this.productChanged.bind(this);
    this.renderSelectBox = this.renderSelectBox.bind(this);
    this.renderOrderHistory = this.renderOrderHistory.bind(this);
  }

  render() {
    return (
      <Form
        labelLocation="top"
        className="form-container"
      >
        <Item render={this.renderSelectBox}>
          {/* <Label text="Department" /> */}
        </Item>
        <Item render={this.renderOrderHistory}>
          <Label text="Repos" />
        </Item>
      </Form>
    );
  }

  renderSelectBox() {
    return <DepartmentSelectBox
      supplierId={this.props.supplierId}
      productId={this.state.chosenProductId}
      onProductChanged={this.productChanged} />;
  }

  renderOrderHistory() {
    return <OrderHistory productId={this.state.chosenProductId} />;
  }

  productChanged(productId) {
    this.setState({
      chosenProductId: productId,
    });
  }
}

export default DeptRepo;
