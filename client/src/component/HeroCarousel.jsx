import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, Container, Button } from "react-bootstrap";
import PostAdModal from "./PostAdModal"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import './HeroCarousel.css'; 

const HeroCarousel = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
  
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
  
const goToSearch = () => {
    // Ye line aapko FormHandling wale page ya section par le jayegi
    navigate('/'); 
    
    // Ye hissa screen ko scroll kar ke us component par rok dega
    setTimeout(() => {
        const element = document.getElementById('search-section'); 
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
};
  return (
    <div className="hero-section-wrapper">
      {/* indicators={true} lazmi hai dots dikhane ke liye */}
      <Carousel className="hero-carousel" controls={false} indicators={true} fade interval={5000}>
        <Carousel.Item>
          <img className="d-block w-100" src="/bg.3.avif" alt="Elite Car Collection" />
          <div className="dark-overlay"></div>
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src="/bg.4.avif" alt="Premium Car Marketplace" />
          <div className="dark-overlay"></div>
        </Carousel.Item>
      </Carousel>

      {/* Signature Theme Shape */}
      <div className="diagram-hero-shape"></div> 

      {/* Content Overlay */}
      <div className="hero-content-overlay">
        <Container>
          <div className="hero-text-box">
            <p className="hero-sub-heading">Find Your Perfect Drive</p>
            <h1 className="hero-main-title">
                Shift Into Gear: Your <span className="text-success">Destination</span>
            </h1>
            <p className="hero-description">
                Experience the most trusted automotive marketplace in Pakistan. Browse verified listings or sell your car at the best price today.
            </p>
            
            <div className="hero-btn-group">
    <Button className="hero-btn hero-btn-primary shadow-sm" onClick={goToSearch}>
    <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
    Find A Car
</Button>
                <Button onClick={handleShow} className="hero-btn-success shadow-sm">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Post Ad Free
                </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Modular Post Ad Modal */}
      <PostAdModal show={showModal} handleClose={handleClose} />
    </div>
  );
};

export default HeroCarousel;