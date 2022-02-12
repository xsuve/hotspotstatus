import React, { Component } from 'react';

class Header extends Component {

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    //
  }

  // Render
  render() {
    return (
      <div className="min-h-screen bg-dark-900 sm:px-48 px-4 flex flex-col items-center justify-center pb-36 pt-40">
        <span className="font-poppins text-xs bg-dark-800 text-primary px-3 py-2 rounded-xl leading-none mb-8 text-center">Check your Hotspot status for FREE - Limited Time!</span>
        <h1 className="font-poppins font-bold sm:text-5xl text-3xl sm:leading-snug text-white text-center mb-10">Helium Hotspot Status <br />Check and Management</h1>
        <p className="font-poppins sm:text-base text-sm leading-loose text-white text-center mb-24">With HotspotStatus you can check if your Helium Hotspot is working properly.<br /> It will ping the hotspot IP address on port 44158 and check for a stable connection.<br /> This will only work for hotspots that have a public IP and port opened.</p>
        <span className="font-poppins text-xs bg-dark-800 text-yellow p-6 rounded-lg leading-relaxed mb-8 text-center break-all">More features are coming soon.<br /><br />Support this project: 13oPEb4wWjxxAzUuBJJakHgeV1nDJPCP8RWKAwHYhctjHK5mhr2<br /><br /><a href="mailto:george@xsuve.com">Click here to get in touch!</a></span>
      </div>
    );
  }

}

export default Header;
