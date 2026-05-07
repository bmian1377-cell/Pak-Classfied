import React, { useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdvertisments } from "../redux/slices/advertisementsSlice"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCar } from '@fortawesome/free-solid-svg-icons';
import './LatestPosting.css';

const BACKEND_URL = "http://localhost:3300";

const LatestCard = ({ image, CarName, Price, Location, _id, Description, Category }) => {
    //Multer Path Fix: {image.replace(/\\/g, "/")}`) Backslashes ko forward 
    // slashes mein badla dyta hai utla sidha slush remove kr dyta hai
    const imgURL = image ? (image.startsWith('http') ? image : `${BACKEND_URL}/${image.replace(/\\/g, "/")}`) : "https://placehold.co/600x400?text=Vehicle+Image";

    return (
        <div className="latest-card-premium shadow-sm">
            <div className="latest-img-container">
                <img src={imgURL} alt={CarName} className="latest-image-main" />
                    
                    {/* toLocaleString(): Ye price ko 1000000 se 1,000,000 mein badalta hai
                     (comma lagata hai) taake parhne mein asani ho. */}
         
           <div className="latest-price-badge">PKR {Price?.toLocaleString()}</div>
            </div>

            <div className="latest-content-box">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-light text-success border small">{Category}</span>
                </div>
                   {/* agar kisi gari ka name lenghthy ho tu text-truncate ko use kr ka hm ... laga kr 
                   card ka desgin kharab nhi hona dyta */}

                <h3 className="latest-car-name text-truncate">{CarName}</h3>
                <p className="latest-desc-text">{Description}</p>
                
                <div className="latest-footer-info">
                    <span className="small text-muted">
                        <FontAwesomeIcon icon={faLocationDot} className="text-success me-1" />
                        {Location || "Pakistan"}
                    </span>
                    <Link to={`/ad/${_id}`}>
                        <button className="btn-view-details">Details</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const LatestPosting = () => {
    const dispatch = useDispatch();
    const { latestAds = [], loading, error } = useSelector((state) => state.advertisment || {}); 

    useEffect(() => {
        dispatch(fetchAdvertisments({ isLatest: true }));
    }, [dispatch]);

    if (loading === 'pending' && latestAds.length === 0) return <div className="text-center py-5"><Spinner variant="success" /></div>;

    return (
        <section className="Latest-section-parent">
            <Container>
                <div className="text-center mb-5">
                    <p className="text-success fw-bold small mb-1 uppercase tracking-widest">Fresh On The Market</p>
                    <h2 className="latest-main-title">Latest <span className="text-success">Postings</span></h2>
                    <div className="latest-divider"></div>
                </div>

                <Row className="g-4">
                    {latestAds.map((ad) => (
                        <Col key={ad._id} xs={12} sm={6} md={4}> 
                            <LatestCard 
                                CarName={ad.Name}
                               image={ad.Images && ad.Images.length > 0 ? ad.Images[0] : null}
                                Price={ad.Price}
                                Description={ad.Description}
                                Location={ad.CityAreaId?.Name}
                                Category={ad.CategoryId?.Name}
                                _id={ad._id}
                            />
                        </Col>
                    ))}
                </Row>
                
                <div className="text-center mt-5">
                    <Button as={Link} to="/all-ads" variant="outline-success" className="fw-bold px-5 py-2">
                        VIEW ALL LISTINGS →
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default LatestPosting;