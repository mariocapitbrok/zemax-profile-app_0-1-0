import React from "react";
import styled from 'styled-components';

const Link = styled.a`
	height: 36px;
	line-height: 36px;
    margin: 0;
    width: auto;
    padding: 9px 16px;
    border: solid 2.5px #0070c0;
    border-radius: 8px;
    font-family: MyriadPro-Semibold, sans-serif;
    font-size: 16px;
    color: #0070c0;
    margin-right: 18px;
    letter-spacing: 0.8px;
    text-transform: none;
    display: inline-flex;
    background: white;
    align-items: center;
    justify-content: center;
    transition: all 0.3s linear 0s;
    cursor: pointer;
    text-decoration: none;
    
    &.inactive {
    	cursor: default;
    	color: #333;
    	border-color: #333;
    }
    
    &:last-of-type {
    	margin-right: 0;
    }
    
    &:not(.inactive):hover{
    	background-color: #0070c0;
    	color: white !important;
    	text-decoration: none;
    }
	`;



const ButtonComponent = ({ onClick, children, ...otherProps }) => {
	return (
		<Link onClick={onClick} {...otherProps}>{children}</Link>
	);
}


export default ButtonComponent;
