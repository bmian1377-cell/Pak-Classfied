import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReferenceData } from '../features/reference/refernceSlice';
import { Link } from 'react-router-dom';
import './CarCategories.css'; 

const BACKEND_URL = "http://localhost:3300";

const CategoryCard = ({ _id, Name, Image }) => {
    
//    imgURL check the logic of image is coming 
//    from backend or  : `${BACKEND_URL}/${Image}`;
//    or extrnal link :Image?.startsWith('http') 

    const imgURL = Image?.startsWith('http') 
        ? Image 
        : `${BACKEND_URL}/${Image}`;

    return (

        // link is use for click on any specific category card they will show the all
        //  related category ads on new page
        <Link to={`/category/${_id}`} className="text-decoration-none">
            <div className="category-full-card shadow">
                {/* 1. Full Card Image */}
                <img 
                    src={imgURL} 
                    alt={Name} 
                    className="category-img-bg"

                //   1:onError aik Event Handler (Function) hai.
                //   2:Jab image ka link (URL) galat ho ya image server par na milay, toh yeh function foran trigger ho kar tooti
                //    hui image ki jagah aik   "Backup" (Placeholder) image set kar deta hai.
                 onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Auto"; }} 
                />
                
                {/* 2. Bottom Left Overlay */}
                <div className="category-card-overlay">
                    <div className="category-label-box">
                        <h4 className="category-name-text">{Name}</h4>
                        <span className="category-count-text">Explore All →</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const CarCategories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.reference);

    useEffect(() => {
        if (categories.length === 0 && !loading) {
            dispatch(fetchReferenceData());
        }
    }, [dispatch, categories.length, loading]);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

    return (
        <section className="categories-section-wrapper py-5">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold text-dark">Explore By <span className="text-success">Categories</span></h2>
                    <div className="category-divider-green mx-auto"></div>
                </div>

                <Row className="g-4">
                    {categories.map((cat) => (
                        <Col key={cat._id} xs={12} sm={6} md={4} lg={3}>
                            <CategoryCard {...cat} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default CarCategories;