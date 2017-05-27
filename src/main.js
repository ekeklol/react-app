"use strict";
import React, { Component } from 'react';
import Menu from './components/menu';
import Footer from './components/footer';

import { connect } from 'react-redux'

class Main extends Component {
  render() {
    return (
      <div>
        <Menu cartItemsNumber={this.props.totalQty} />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    totalQty: state.cart.totalQty
  }
}

export default connect(mapStateToProps)(Main);
