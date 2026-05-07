import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './About.css'; 

const About = () => {
    return (
        <div className="about-page-wrapper">
            {/* --- HERO SECTION WITH WATERMARK --- */}
            <section className="about-hero">
                {/* Background Watermark Logo */}
                <div className="about-logo-watermark">
                    <span className="wm-pak">PAK</span>
                    <span className="wm-classified">CLASSIFIED</span>
                </div>

                <Container className="about-hero-content">
                    <Row className="py-5">
                        <Col lg={8}>
                            <p className="text-success fw-bold mb-2 uppercase tracking-widest">Premium Marketplace</p>
                            <h1 className="display-2 fw-bold text-uppercase">About <span className="text-success">Us</span></h1>
                            <p className="fs-5 opacity-75">Innovating the car buying and selling experience in Pakistan.</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* --- CONTENT SECTION WITH ZIG-ZAG IMAGES --- */}
            <section className="py-5 my-5">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={6}>
                            <div className="image-grid-wrapper">
                                <Row className="g-3">
                                    <Col xs={6}>
                                        <img src="/bg.9.avif" className="about-img-item" alt="Collection 1" />
                                    </Col>
                                    <Col xs={6}>
                                        <img src="/bg.10.avif" className="about-img-item img-offset-down" alt="Collection 2" />
                                    </Col>
                                    <Col xs={6}>
                                        <img src="/bg.11.avif" className="about-img-item img-offset-up" alt="Collection 3" />
                                    </Col>
                                    <Col xs={6}>
                                        <img src="/bg.12.avif" className="about-img-item" alt="Collection 4" />
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        <Col lg={6}>
                            <h2 className="fw-bold mb-4">
                                PAK<span className="text-success">CLASSIFIED</span> <br />
                                <small className="text-muted fs-4">A Comprehensive Online Platform</small>
                            </h2>
                            <p className="text-muted mb-4 fs-5">
                                Welcome to PakClassified, your premier destination for all things automotive in Pakistan. 
                                Our platform is designed to offer a seamless experience for users looking to browse, buy, 
                                sell, and compare cars.
                            </p>

                            <div className="mt-4">
                                {[
                                    "Dedicated Customer Support & Guidance",
                                    "24/7 Technical Assistance",
                                    "Genuine Feedback and Suggestions"
                                ].map((text, i) => (
                                    <div key={i} className="d-flex align-items-center mb-3">
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3 fs-5" />
                                        <span className="fw-bold text-dark">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* --- SIMPLE STATS BAR --- */}
            <section className="bg-dark text-white py-5 shadow-inner">
                <Container>
                    <Row className="text-center g-4">
                        <Col xs={6} md={3}>
                            <h2 className="fw-bold text-success">50K+</h2>
                            <p className="small text-uppercase opacity-50">Active Users</p>
                        </Col>
                        <Col xs={6} md={3}>
                            <h2 className="fw-bold text-success">12K+</h2>
                            <p className="small text-uppercase opacity-50">Vehicles Listed</p>
                        </Col>
                        <Col xs={6} md={3}>
                            <h2 className="fw-bold text-success">5K+</h2>
                            <p className="small text-uppercase opacity-50">Monthly Sales</p>
                        </Col>
                        <Col xs={6} md={3}>
                            <h2 className="fw-bold text-success">100%</h2>
                            <p className="small text-uppercase opacity-50">Verified Ads</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default About;