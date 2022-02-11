import React, { Component } from 'react';

class Navbar extends Component {

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
      <div className="h-20 bg-dark-800 sm:px-48 px-4 flex items-center fixed w-full">
        <div className="grid grid-cols-3">
          <div className="sm:col-span-1 col-span-3">
            <div className="font-poppins text-white font-bold text-xl flex items-center">
              <svg className="h-7 w-7 text-white mr-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z"/>
                <g transform="rotate(-45 12 18)">
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                  <path d="M12 14a4 4 0 0 1 4 4" />
                  <path d="M12 10a8 8 0 0 1 8 8" />
                  <path d="M12 6a12 12 0 0 1 12 12" />
                </g>
              </svg>
              <div>Hotspot<span className="text-green">Status</span></div>
              <div className="h-full bg-slate-400 w-px mx-3">&nbsp;</div>
              <span className="font-poppins text-slate-400 font-thin text-xs tracking-widest">BETA</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Navbar;
