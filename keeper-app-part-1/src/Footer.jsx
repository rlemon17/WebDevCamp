import React from "react";

const Footer = () => {

    const date = new Date();
    const year = date.getFullYear();

    return (
        <footer>
            <p>Ryan Lemon ⓒ {year}</p>
        </footer>
    )
};

export default Footer;