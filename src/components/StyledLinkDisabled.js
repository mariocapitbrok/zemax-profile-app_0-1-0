import React from "react";
import styled from 'styled-components';

const Link = styled.a`
	height: 36px;
	line-height: 36px;
    margin: 0;
    width: auto;
    padding: 9px 16px;
    border: solid 2.5px #999;
    border-radius: 8px;
    font-family: MyriadPro-Semibold, sans-serif;
    font-size: 16px;
    color: #999;
    margin-right: 18px;
    letter-spacing: 0.8px;
    text-transform: none;
    display: inline-flex;
    background: white;
    align-items: center;
    justify-content: center;
    transition: all 0.3s linear 0s;
    cursor: default;
    text-decoration: none;
    
    &:hover{
    	color: #999 !important;
    	text-decoration: none
    }
	`;



const ButtonComponent = ({ onClick, children, ...otherProps }) => {
	return (
		<Link {...otherProps}>{children}</Link>
	);
}


export default ButtonComponent;
