import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer-professional pt-5"> 
            <Container className="pb-4">
                <Row className="g-4">
                    <Col lg={4}>
                        <h4 className="text-success fw-bold mb-4">PakClassified</h4>
                        <p className="footer-about-text pe-lg-4">
                            Pakistan's most trusted marketplace for cars. Buy, sell, and explore the best automotive deals across the country.
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            {[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((icon, i) => (
                                <a key={i} href="#" className="social-link-item"><FontAwesomeIcon icon={icon} /></a>
                            ))}
                        </div>
                    </Col>

                    <Col lg={2} md={4}>
                        <h6 className="text-white fw-bold mb-4">Quick Links</h6>
                        <ul className="list-unstyled footer-menu">
                            {["Home", "About Us", "Categories", "Contact Us"].map((link, i) => (
                                <li key={i} className="mb-2"><a href="#">{link}</a></li>
                            ))}
                        </ul>
                    </Col>

                    <Col lg={3} md={4}>
                        <h6 className="text-white fw-bold mb-4">Support</h6>
                        <div className="footer-contact-item mb-3 d-flex align-items-start">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success mt-1 me-3" />
                            <span>Gulberg III, Lahore, Pakistan</span>
                        </div>
                        <div className="footer-contact-item mb-3 d-flex align-items-center">
                            <FontAwesomeIcon icon={faPhone} className="text-success me-3" />
                            <span>+92 300 1 387 387</span>
                        </div>
                        <div className="footer-contact-item d-flex align-items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="text-success me-3" />
                            <span>support@pakclassified.com</span>
                        </div>
                    </Col>

                    <Col lg={3} md={4}>
                        <h6 className="text-white fw-bold mb-4">Stay Updated</h6>
                        <p className="small footer-about-text mb-3">Get latest car news directly to your inbox.</p>
                        <Form className="d-flex gap-2">
                            <Form.Control placeholder="Email" className="newsletter-field" />
                            <Button variant="success" size="sm" className="fw-bold px-3">JOIN</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            
            <div className="footer-bottom py-3">
                <Container className="d-flex justify-content-between align-items-center flex-column flex-md-row">
                    <p className="mb-0 small opacity-50 text-white">© 2024 PakClassified. Designed by Team EVS</p>
                    <div className="mt-2 mt-md-0">
                        <a href="#" className="text-white opacity-50 small text-decoration-none mx-2">Privacy Policy</a>
                        <a href="#" className="text-white opacity-50 small text-decoration-none mx-2">Terms</a>
                    </div>
                </Container>
            </div>
        </footer>
    );
};
export default Footer;