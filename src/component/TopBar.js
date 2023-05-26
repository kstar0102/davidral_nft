import React from 'react';
import CustomButton from './CustomButton';
import Logo from '../assets/myLogo.png';

function TopBar(props) {
    return ( 
        <div className='top-bar'>
            <div className='left-top-bar'>
            <ul>
                <li>
                    <a href="#home">
                        <img src={Logo} alt='Logo'></img>
                    </a>
                </li>
                <li><a href="#news">About us</a></li>
                <li><a href="#contact">Arcade</a></li>
                <li><a href="#about">Merch</a></li>
                <li><a href="#about">Roadmap</a></li>
                <li><a href="#about">Project Vintage</a></li>
                <li><a href="#about">Team</a></li>
            </ul>
            </div>
            <div className='right-top-bar'>
                <CustomButton onClick={props.handleConnection} label="Connect Wallet" style={{fontSize: '0.8rem', width: '9rem', height: '2.2rem'}}></CustomButton>
            </div>
        </div>
    );
}

export default TopBar;