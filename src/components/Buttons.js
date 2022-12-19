import React from "react";
import styled from 'styled-components';

const Button = styled.button`
	height: 36px;
    margin: 0;
    padding: 9px 16px;
    border: solid 2.5px #0070c0;
    border-radius: 8px;
    font-family: MyriadPro-Semibold, sans-serif;
    font-size: 16px;
    line-height: 1;
    color: #0070c0;
    letter-spacing: 0.8px;
    text-transform: none;
    display: flex;
    background: white;
    align-items: center;
    justify-content: center;
    transition: all 0.3s linear 0s;
    cursor: pointer;
    
    &:hover{
    	background-color: #0070c0;
    	color: white !important;
    }
	`;

const ButtonComponent = ({ onClick, children, ...otherProps }) => {
	return (
		<Button onClick={onClick} {...otherProps}>{children}</Button>
	);
}


export default ButtonComponent;
