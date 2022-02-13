import React, { Component } from 'react';

// Components
import Navbar from './../components/Navbar';
import Header from './../components/Header';

import axios from 'axios';

class Home extends Component {

  constructor() {
    super();

    this.state = {
      heliumAPI: 'https://api.helium.io/v1',
      api: 'http://localhost:8000',
      // api: 'https://hotspotstatus.herokuapp.com',

      search: '',
      searchResults: [],
      notFound: false,
      loadingSearch: false,
      loadingPing: false,

      hotspot: {
        name: '',
        listen_addrs: '',
        ip: '',
        port: '',
        pingStatus: undefined,
        status: false,
        validIP: false,
        transmitScale: 0,
        blockchainBlockHeight: 0,
        hotspotBlockHeight: 0
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.searchHotspot = this.searchHotspot.bind(this);
    this.pingHotspot = this.pingHotspot.bind(this);
    this.formatHotspotName = this.formatHotspotName.bind(this);
    this.setSearch = this.setSearch.bind(this);
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

    return formatted.slice(0, -1);
  }

  //
  validIP(ip) {
    if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
      return true;
    }

    return false;
  }

  //
  handleChange(event) {
    this.setState({
      search: event.target.value
    });

    axios.get(this.state.heliumAPI + '/hotspots/name?search=' + this.state.search).then(response => {
      if(response.data.data) {
        const hotspots = [];

        response.data.data.forEach((hotspot, i) => {
          if(i < 3) {
            hotspots.push({
              name: this.formatHotspotName(hotspot.name),
              location: hotspot.geocode.short_state + ', ' + hotspot.geocode.long_country,
              status: hotspot.status.online == 'online'
            });
          }
        });

        this.setState({
          searchResults: hotspots
        });
      }
    }).catch(error => {
      this.setState({
        searchResults: []
      });
    });
  }

  //
  setSearch(name) {
    this.setState({
      search: '',
      searchResults: []
    });

    this.searchHotspot(name);
  }

  //
  searchHotspot(name) {
    this.setState({
      loadingSearch: true
    });

    axios.get(this.state.heliumAPI + '/hotspots/name?search=' + name).then(response => {
      const { ip, port } = this.parseListenAddrs(response.data.data[0].status.listen_addrs[0]);

      console.log(response.data.data[0]);

      this.setState({
        loadingSearch: false,
        search: '',
        hotspot: {
          name: response.data.data[0].name,
          listen_addrs: response.data.data[0].status.listen_addrs[0],
          ip: ip,
          port: port,
          validIP: this.validIP(ip),
          status: response.data.data[0].status.online == 'online',
          transmitScale: response.data.data[0].reward_scale.toFixed(2),
          blockchainBlockHeight: response.data.data[0].block,
          hotspotBlockHeight: response.data.data[0].last_change_block
        }
      });
    }).catch(error => {
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
          pingStatus: response.data.status
        }
      });
    }).catch(error => {
      this.setState({
        loadingPing: false,
        hotspot: {
          pingStatus: false
        }
      });
    });
  }

  // Render
  render() {
    return (
      <>
        <Navbar />
        <Header />

        <div className="sm:grid sm:grid-cols-5 px-4">
          <div></div>
          <div className="col-span-3 relative">
            <div className={`bg-dark-700 py-4 px-6 flex sm:flex-row flex-col items-center w-full absolute sm:-top-11 -top-10 ${this.state.search.length == 0 ? 'rounded-xl' : 'rounded-tl-xl rounded-tr-xl'}`}>
              <input className="w-full sm:h-14 h-12 sm:p-0 mb-0 bg-transparent text-white font-poppins sm:text-base text-sm sm:text-left text-center outline-0 ring-0 border-transparent focus:outline-0 focus:ring-0 focus:border-transparent" type="text" value={this.state.search} onChange={this.handleChange} placeholder="Enter hotspot name" />
              <div className="rounded-bl-xl rounded-br-xl w-full absolute right-0 left-0 top-20 z-10 overflow-hidden">
                {
                  this.state.searchResults.length > 0 ?
                    this.state.searchResults.map((hotspot, index) => (
                      <div key={index} className="bg-dark-700 p-6 border-t border-dark-800 cursor-pointer flex items-center justify-between" onClick={() => this.setSearch(hotspot.name)}>
                        <div>
                          <p className="font-poppins font-medium text-white text-sm mb-2">{hotspot.name}</p>
                          <p className="font-poppins text-slate-400 text-xs">{hotspot.location}</p>
                        </div>
                        <p className={`font-poppins text-xs ${hotspot.status ? 'text-green' : 'text-primary'}`}>{hotspot.status ? 'Online' : 'Offline'}</p>
                      </div>
                    ))
                  :
                    this.state.search.length != 0 ?
                      <div className="bg-dark-700 p-6 border-t border-dark-800">
                        <p className="font-poppins text-white text-sm">No hotspot found.</p>
                      </div>
                    :
                      null
                }
              </div>
            </div>
          </div>
          <div></div>
        </div>

        <div className="sm:px-36 px-4 pt-28 pb-20 bg-dark-800">
          <div className="grid grid-cols-2 sm:gap-20 gap-10">
            {
              this.state.search.length == 0 && this.state.hotspot.name.length > 0 ?
                <>
                  <div className="sm:col-span-1 col-span-2">
                    <h1 className="font-poppins text-white text-3xl font-bold mb-6 flex items-center"><div className={`w-2.5 h-2.5 rounded-full mr-4 ${this.state.hotspot.status ? 'bg-green' : 'bg-primary'}`}>&nbsp;</div> {this.formatHotspotName(this.state.hotspot.name)}</h1>
                    <p className="font-poppins text-white text-base mb-8 break-words">{this.state.hotspot.listen_addrs}</p>
                    <div className="w-full flex flex-row items-center justify-start">
                      <button className="rounded-lg bg-green text-dark-800 font-medium font-poppins sm:text-base text-sm px-6 py-4 mr-6 disabled:opacity-60" onClick={this.pingHotspot} disabled={this.state.hotspot.validIP ? (this.state.loadingPing ? true : false) : true}>{this.state.loadingPing ? 'Loading...' : 'Ping Hotspot'}</button>
                      {
                        this.state.hotspot.validIP ?
                          this.state.hotspot.pingStatus != undefined ?
                            <p className={`font-poppins text-sm ${this.state.hotspot.pingStatus ? 'text-green' : 'text-primary'}`}>Hotspot is {this.state.hotspot.pingStatus ? 'Online' : 'Offline'}!</p>
                          :
                            this.state.loadingPing && <p className="font-poppins text-white text-sm">Loading...</p>
                        :
                          <p className='font-poppins text-sm text-primary'>The hotspot does not have a static/public IP address.</p>
                      }
                    </div>
                  </div>
                  <div className="sm:col-span-1 col-span-2">
                    <div className="flex sm:flex-row flex-col justify-between sm:items-center items-stretch">
                      <div className="bg-dark-900 rounded-xl p-6 text-center">
                        <h6 className="font-poppins text-white text-lg font-semibold mb-4">{this.state.hotspot.hotspotBlockHeight}</h6>
                        <p className="font-poppins text-slate-400 text-sm">Block Height</p>
                      </div>
                      <div className="bg-dark-900 rounded-xl p-6 text-center sm:mx-6 my-6">
                        <h6 className="font-poppins text-white text-lg font-semibold mb-4">{this.state.hotspot.blockchainBlockHeight - this.state.hotspot.hotspotBlockHeight}</h6>
                        <p className="font-poppins text-slate-400 text-sm">Block Gap</p>
                      </div>
                      <div className="bg-dark-900 rounded-xl p-6 text-center">
                        <h6 className="font-poppins text-white text-lg font-semibold mb-4">{this.state.hotspot.transmitScale}</h6>
                        <p className="font-poppins text-slate-400 text-sm">Transmit Scale</p>
                      </div>
                    </div>
                  </div>
                </>
              :
                <div className="col-span-3">
                  {
                    this.state.notFound ?
                      <p className="font-poppins text-white text-base">Hotspot not found.</p>
                    :
                      this.state.loadingSearch ?
                        <p className="font-poppins text-white text-base">Searching hotspot...</p>
                      :
                        <>
                          <svg className="h-8 w-8 text-white mx-auto animate-bounce"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                          </svg>
                          <p className="font-poppins text-white text-xl text-center mt-8">Type in the name of the Helium Hotspot</p>
                        </>
                  }
                </div>
            }
          </div>
        </div>
      </>
    );
  }

}

export default Home;
