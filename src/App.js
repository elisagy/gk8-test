import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import * as debounce from 'debounce';
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Form from 'react-bootstrap/Form';
import './App.css';

const apikey = '2BJAENXZBR3KYY5G2U4ZHMCZ6UA74SZYDT';

const columns = [{
  dataField: 'timeStamp',
  text: 'Timestamp',
  sort: true
}, {
  dataField: 'from',
  text: 'From Transaction',
  sort: true
}, {
  dataField: 'to',
  text: 'To Transaction',
  sort: true
}, {
  dataField: 'value',
  text: 'Value',
  sort: true
}, {
  dataField: 'confirmations',
  text: 'Confirmations',
  sort: true
}, {
  dataField: 'hash',
  text: 'Hash',
  sort: true
}];


class App extends Component {
    constructor(props) {
      super(props);
      this.state = { errorMsg: '',
        ethereumAddress: '',
        loading: false,
        transactions: []
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleChange(event) {
      this.setState({
        errorMsg: '',
        ethereumAddress: '',
        loading: true,
        transactions: []
      });
      const { status, result } = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${event.target.value}&startblock=0&endblock=99999999&sort=asc&apikey=${apikey}`).then(response => response.json())
      if (status === "1") {
        this.setState({
          errorMsg: '',
          ethereumAddress: event.target.value,
          loading: false,
          transactions: result.slice(0, 10000)
        });
      } else {
        this.setState({
          errorMsg: result,
          ethereumAddress: '',
          loading: false,
          transactions: []
        });
      }
    }

    handleSubmit(event) {
      event.preventDefault();
    }

    render() {
      return (
        <div className="App">
          <div className="App-inner">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Enter Ethereum Address" onChange={debounce(this.handleChange, 200)} />
              </Form.Group>
            </Form>
            { this.state.loading ?
                (<div className="spinner-wrapper">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>) : 
                this.state.errorMsg ?
                  (<p>{ this.state.errorMsg }</p>) : 
                  (<BootstrapTable keyField='timeStamp' data={ this.state.transactions } columns={ columns } />)
            }
          </div>
        </div>
      );
    }
}

export default App;
