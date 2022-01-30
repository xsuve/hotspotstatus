import React, { Component } from 'react';

import axios from 'axios';

class App extends Component {

  constructor() {
    super();

    this.state = {
      heliumAPI: 'https://api.helium.io/v1',
      api: 'http://localhost:8000',

      search: '',

      hotspot: {
        name: '',
        listen_addrs: '',
        ip: '',
        port: '',
        status: undefined
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.searchHotspot = this.searchHotspot.bind(this);
    this.pingHotspot = this.pingHotspot.bind(this);
  }

  componentDidMount() {
    //
  }

  //
  handleChange(event) {
    this.setState({
      search: event.target.value
    });
  }

  //
  searchHotspot() {
    axios.get(this.state.heliumAPI + '/hotspots/name?search=' + this.state.search).then(response => {
      const { ip, port } = this.parseListenAddrs(response.data.data[0].status.listen_addrs[0]);
      this.setState({
        hotspot: {
          name: response.data.data[0].name,
          listen_addrs: response.data.data[0].status.listen_addrs[0],
          ip: ip,
          port: port
        }
      });
    }).catch(error => {
      console.log(error);
    });
  }

  //
  parseListenAddrs(listen_addrs) {
    const parts = listen_addrs.split('/');
    const ip = parts[2];
    const port = parts[4];

    return { ip, port };
  }

  //
  pingHotspot() {
    const { ip, port } = this.state.hotspot;

    axios.get(this.state.api + '/ping?ip=' + ip + '&port=' + port).then(response => {
      this.setState({
        hotspot: {
          ...this.state.hotspot,
          status: response.data.status
        }
      });
    }).catch(error => {
      this.setState({
        hotspot: {
          status: false
        }
      });
    });
  }

  // Render
  render() {
    return (
      <>
        <input type="text" value={this.state.search} onChange={this.handleChange} placeholder="Hotspot name" />
        <button onClick={this.searchHotspot}>Search</button>
        <h1>{this.state.hotspot.name}</h1>
        <p>{this.state.hotspot.listen_addrs}</p>
        {
          this.state.hotspot.name.length > 0 &&
          <>
            <button onClick={this.pingHotspot}>Ping Hotspot</button>
          </>
        }

        {
          this.state.hotspot.status != undefined &&
          <>
            <p>Ping {this.state.hotspot.ip}:{this.state.hotspot.port}</p>
            <p>Hotspot is {this.state.hotspot.status ? 'Online' : 'Offline'}!</p>
          </>
        }
      </>
    );
  }

}

export default App;
