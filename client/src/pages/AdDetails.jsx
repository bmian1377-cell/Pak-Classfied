import React, { useEffect } from 'react';
import { Container, Row, Col, Carousel, Card, Image, Button, Spinner, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdDetail } from '../redux/slices/advertisementsSlice'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faTag, faCalendarAlt, faShieldAlt, faEnvelope, faPhone, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './AdDetails.css'; 

const BACKEND_URL = "http://localhost:3300";

const AdDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { details, loading, error } = useSelector(state => state.advertisment);

    // Page load hotay hi Ad ka data mangwao
    useEffect(() => { 
        if(id) {
            dispatch(fetchAdDetail(id)); 
        }
    }, [id, dispatch]);

    // Agar data aa raha hai ya error hai toh yahan rok lo
    if (loading === 'pending') return <div className="text-center py-5 vh-100 mt-5"><Spinner variant="success" animation="border" /></div>;
    if (error) return <div className="text-center py-5 text-danger fw-bold">{error}</div>;
    if (!details) return <div className="text-center py-5 text-muted">Loading Vehicle Details...</div>;

    // Asani ke liye details mein se saara data alag alag kar liya
    const { Name, Price, Images, Features, Description, CategoryId, CityAreaId, StatusId, OwnerId, StartsOn } = details;

    //owner ki photo na ho tu placeholder laga dyein ga hm taky error na ayein
    const ownerPic = OwnerId?.Image 
        ? (OwnerId.Image.startsWith("http") ? OwnerId.Image : `${BACKEND_URL}/${OwnerId.Image.replace(/\\/g, "/")}`)
        : "/default_profile.png";

     // yaha hmny image path issue ka function bnya hai agar image backend sy ayy tb bi chlein
     //agar external link ho tb bi chlein
    const getCarImage = (imgPath) => {
        if (!imgPath) return "https://placehold.co/800x500?text=No+Image";
        return imgPath.startsWith("http") ? imgPath : `${BACKEND_URL}/${imgPath.replace(/\\/g, "/")}`;
    };

    return (
        <div className="ad-details-wrapper">
            <Container>
                <Row className="g-4">
                    
                    {/* LEFT SIDE: GAARI KI DETAILS */}
                    <Col lg={8}>
                       
                        <Carousel className="premium-carousel" interval={3000}>
                            {Images && Images.length > 0 ? (
                                Images.map((img, index) => (
                                    <Carousel.Item key={index}>
                                        <div className="carousel-img-wrapper">
                                            {/* ✅ Yahan getCarImage function use kiya hai */}
                                            <img src={getCarImage(img)} alt={`Car View ${index + 1}`} />
                                        </div>
                                    </Carousel.Item>
                                ))
                            ) : (
                                <Carousel.Item>
                                    <div className="carousel-img-wrapper">
                                        <img src="https://placehold.co/800x500?text=No+Image" alt="No image" />
                                    </div>
                                </Carousel.Item>
                            )}
                        </Carousel>

                    
                        <Card className="car-info-card">
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                <div>
                                    <Badge bg={StatusId?.Name === 'Sold' ? 'danger' : 'success'} className="mb-2 px-3 py-2 fs-6">
                                        {StatusId?.Name || 'Active'}
                                    </Badge>
                                    <h1 className="fw-bolder text-dark mb-1">{Name}</h1>
                                </div>
                                <div className="price-tag-big">
                                    PKR {Price?.toLocaleString()}
                                </div>
                            </div>

                            {/* Choti Information  location catgory wagra*/}
                            <div className="quick-info-grid">
                                <div className="quick-info-box">
                                    <div className="quick-info-icon"><FontAwesomeIcon icon={faLocationDot} /></div>
                                    <div>
                                        <small className="text-muted d-block">Location</small>
                                        <span className="fw-bold text-dark">{CityAreaId?.Name || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="quick-info-box">
                                    <div className="quick-info-icon"><FontAwesomeIcon icon={faTag} /></div>
                                    <div>
                                        <small className="text-muted d-block">Category</small>
                                        <span className="fw-bold text-dark">{CategoryId?.Name || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="quick-info-box">
                                    <div className="quick-info-icon"><FontAwesomeIcon icon={faCalendarAlt} /></div>
                                    <div>
                                        <small className="text-muted d-block">Posted On</small>
                                        <span className="fw-bold text-dark">{StartsOn ? new Date(StartsOn).toLocaleDateString() : 'Recently'}</span>
                                    </div>
                                </div>
                            </div>

                            <h4 className="fw-bold text-dark mt-4 mb-3">Key Features</h4>
                            <div className="features-box text-muted">
                                {Features || "No specific features mentioned by the seller."}
                            </div>
                            
                            <h4 className="fw-bold text-dark mt-5 mb-3">Seller's Description</h4>
                            <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                                {Description || "No description provided."}
                            </p>
                        </Card>
                    </Col>

                    {/* RIGHT SIDE: OWNER KI PROFILE */}
                    <Col lg={4}>
                        <div className="sticky-owner-sidebar">
                            <Card className="owner-profile-card">
                                <div className="owner-card-header"></div>
                                <div className="owner-avatar-wrapper">
                                   
                                    <Image src={ownerPic} className="owner-avatar" />
                                </div>
                                <Card.Body className="px-4 pb-4">
                                    <h3 className="fw-bold text-dark text-capitalize mb-2">{OwnerId?.Name || 'Unknown Seller'}</h3>
                                    
                                    <div className="verified-badge mb-4">
                                        <FontAwesomeIcon icon={faShieldAlt} /> Verified Member
                                    </div>

                                    <div className="contact-info-list">
                                        <div className="contact-item">
                                            <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                                            <div>
                                                <small className="text-muted d-block">Contact Number</small>
                                                <span className="fw-bold fs-5 text-dark">{OwnerId?.ContactNumber || 'Hidden'}</span>
                                            </div>
                                        </div>
                                        <div className="contact-item">
                                            <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                                            <div>
                                                <small className="text-muted d-block">Email Address</small>
                                                <span className="fw-bold text-dark">{OwnerId?.Email || 'Hidden'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="btn-contact-seller w-100 mt-4">
                                        <FontAwesomeIcon icon={faCheckCircle} className="me-2" /> SHOW INTEREST
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default AdDetails;