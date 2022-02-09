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
      <>
        <div className="min-h-screen bg-dark-900 px-48 flex flex-col items-center justify-center pb-36">
          <span className="font-poppins text-xs bg-dark-800 text-primary px-3 py-2 rounded-xl leading-none mb-8">Check your Hotspot status for FREE - Limited Time!</span>
          <h1 className="font-poppins font-bold text-5xl leading-snug text-white text-center mb-10">Helium Hotspot Status <br />Check and Management</h1>
          <p className="font-poppins text-base leading-loose text-white text-center">Now it is easier than you think to check if your Helium Hotspot <br />is working properly. Just type in the name of your Hotspot and check <br />the status to see if it is Online or Offline.</p>
        </div>
      </>
    );
  }

}

export default Header;
