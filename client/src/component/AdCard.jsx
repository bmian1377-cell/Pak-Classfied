import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BACKEND_URL = "http://localhost:3300";

const AdCard = ({ ad }) => {
  // ad prop was use in LatestPosting or CategoryAds
  const { _id, Name, Images, Price, Description, CityAreaId } = ad || {};

  // multer solution logic
  const imgPath = Images && Images.length > 0 ? Images[0] : null;
  const imgURL = imgPath?.startsWith('http') 
    ? imgPath 
    : imgPath ? `${BACKEND_URL}/${imgPath.replace(/\\/g, "/")}` : "https://placehold.co/600x400?text=No+Image";

  return (
    <Card className="shadow-sm h-100 border-0 overflow-hidden ad-card-hover">
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img variant="top" src={imgURL} alt={Name} style={{ height: '100%', objectFit: 'cover', transition: '0.3s' }} />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate fw-bold mb-1">{Name}</Card.Title>
        <div className="mb-2">
            <small className="text-muted">
                <i className="fa-solid fa-location-dot text-success me-1"></i>
                {CityAreaId?.Name || "Pakistan"}
            </small>
        </div>
        <Card.Text className="fw-bold text-success fs-5 mb-2">
          PKR {Price ? Price.toLocaleString('en-US') : "N/A"}
        </Card.Text>
        <Card.Text style={{ fontSize: '0.85rem' }} className="text-muted line-clamp-2 mb-3">
          {Description ? Description.substring(0, 60) + '...' : 'No description available.'}
        </Card.Text>
        <Link to={`/ad/${_id}`} className="mt-auto">
          <Button variant="success" className="w-100 fw-bold border-0">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default AdCard;