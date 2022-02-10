import React, { Component } from 'react';

// Components
import Header from './../components/Header';

import axios from 'axios';

class Home extends Component {

  constructor() {
    super();

    this.state = {
      heliumAPI: 'https://api.helium.io/v1',
      // api: 'http://localhost:8000',
      api: 'https://hotspotstatus.herokuapp.com',

      search: '',
      notFound: false,
      loadingSearch: false,
      loadingPing: false,

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
    this.formatHotspotName = this.formatHotspotName.bind(this);
  }

  componentDidMount() {
    //
  }

  //
  formatHotspotName(name) {
    const words = name.split('-');
    let formatted = '';
    words.map((word) => {
      formatted += word[0].toUpperCase() + word.substring(1) + ' ';
    });

    return formatted;
  }

  //
  handleChange(event) {
    this.setState({
      search: event.target.value
    });
  }

  //
  searchHotspot() {
    this.setState({
      loadingSearch: true
    });

    axios.get(this.state.heliumAPI + '/hotspots/name?search=' + this.state.search).then(response => {
      const { ip, port } = this.parseListenAddrs(response.data.data[0].status.listen_addrs[0]);
      this.setState({
        loadingSearch: false,
        search: '',
        hotspot: {
          name: response.data.data[0].name,
          listen_addrs: response.data.data[0].status.listen_addrs[0],
          ip: ip,
          port: port
        }
      });
    }).catch(error => {
      console.log(error);
      this.setState({
        loadingSearch: false,
        notFound: true
      });
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
    this.setState({
      loadingPing: true
    });

    const { ip, port } = this.state.hotspot;

    axios.get(this.state.api + '/ping?ip=' + ip + '&port=' + port).then(response => {
      this.setState({
        loadingPing: false,
        hotspot: {
          ...this.state.hotspot,
          status: response.data.status
        }
      });
    }).catch(error => {
      this.setState({
        loadingPing: false,
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
        <Header />

        <div className="sm:grid sm:grid-cols-5 px-4">
          <div></div>
          <div className="col-span-3 relative">
            <div className="bg-dark-700 rounded-xl sm:pl-7 sm:pr-4 sm:py-4 p-4 flex sm:flex-row flex-col items-center w-full absolute sm:-top-11 -top-20">
              <input className="w-full sm:h-16 h-14 sm:p-0 pb-4 mb-0 bg-transparent text-white font-poppins text-base sm:text-left text-center outline-0 ring-0 border-transparent focus:outline-0 focus:ring-0 focus:border-transparent" type="text" value={this.state.search} onChange={this.handleChange} placeholder="Enter hotspot name" />
              <button className="sm:w-auto w-full sm:h-16 h-14 rounded-lg bg-primary text-dark-800 font-medium font-poppins sm:text-base text-sm px-8 disabled:opacity-60" onClick={this.searchHotspot} disabled={this.state.loadingSearch}>{this.state.loadingSearch ? 'Searching...' : 'Search'}</button>
            </div>
          </div>
          <div></div>
        </div>

        <div className="sm:px-36 px-4 pt-32 sm:pb-24 pb-24 sm:min-h-48 bg-dark-800">
          {
            this.state.search.length == 0 && this.state.hotspot.name.length > 0 ?
            <>
              <h1 className="font-poppins text-white text-3xl font-bold mb-6">{this.formatHotspotName(this.state.hotspot.name)}</h1>
              <p className="font-poppins text-white text-base mb-8 break-words">{this.state.hotspot.listen_addrs}</p>
              <div className="w-full flex flex-row items-center justify-start">
                <button className="rounded-lg bg-green text-dark-800 font-medium font-poppins sm:text-base text-sm px-6 py-4 mr-6 disabled:opacity-60" onClick={this.pingHotspot} disabled={this.state.loadingPing}>{this.state.loadingPing ? 'Loading...' : 'Ping Hotspot'}</button>
                { this.state.hotspot.status != undefined ?
                  <p className={`font-poppins text-sm ${this.state.hotspot.status ? 'text-green' : 'text-primary'}`}>Hotspot is {this.state.hotspot.status ? 'Online' : 'Offline'}!</p>
                  :
                  this.state.loadingPing &&
                  <p className="font-poppins text-white text-sm">Loading...</p>
                }
              </div>
            </>
            :
            this.state.loadingSearch ?
            <p className="font-poppins text-white text-base">Searching hotspot...</p>
            :
            this.state.notFound &&
            <p className="font-poppins text-white text-base">Hotspot not found.</p>
          }
        </div>
      </>
    );
  }

}

export default Home;
