import React from "react";
import Logo from "../Assets/la-burguera-favicon-color.png";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-logo-container">
          <img src={Logo} alt="La Burguera Logo" />
        </div>
        <div className="footer-icons">
          <BsTwitter />
          <SiLinkedin />
          <BsYoutube />
          <FaFacebookF />
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>Calidad</span>
          <span>Ayuda</span>
          <span>Compartir</span>
          <span>Carreras</span>
          <span>Testimonios</span>
          <span>Trabajo</span>
        </div>
        <div className="footer-section-columns">
          <span>244-5333-7783</span>
          <span>hola@laburguera.com</span>
          <span>prensa@laburguera.com</span>
          <span>contacto@laburguera.com</span>
        </div>
        <div className="footer-section-columns">
          <span>Términos y Condiciones</span>
          <span>Política de Privacidad</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
