import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { fetchAdsByCategory } from '../redux/slices/advertisementsSlice';
import AdCard from './AdCard'; 

function CategoryAds() {
    const dispatch = useDispatch();

    // requesting for categoryId using useparmas() 
    // .../category/123   {123 was the id} 
    const { categoryId } = useParams(); 
    
    const { categoryAds, loading, error } = useSelector(state => state.advertisment);


    // 1. if condition is true
    // 2. call the redux =>(dispatch(fetchAdsByCategory(categoryId)))
    // 3. show only those realted ads
    useEffect(() => {
        if (categoryId) {
            dispatch(fetchAdsByCategory(categoryId)); 
        }
    }, [categoryId, dispatch]); 




    // . Conditional Rendering for better user expeirce
        //Loading State => show spinner
        //error state =>   show alert/toasitfy message
        //Zero Ads =>      show speicfic message

        //loading state
     if (loading === 'pending') {
        return (
            <div className="text-center py-5" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="success" className="mb-3" />
                <h4 className="text-muted">Filtering Advertisements...</h4>
            </div>
        );
    }

    //error state
    if (error) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger" className="border-0 shadow-sm">
                    {error}
                </Alert>
            </Container>
        );
    }
    
    //Zero ad state
    if (categoryAds.length === 0) {
        return (
            <Container className="py-5 text-center" style={{ minHeight: '60vh' }}>
                <div className="p-5 bg-white rounded-4 shadow-sm">
                    <h2 className="text-muted">😞 No Ads Found</h2>
                    <p>There are currently no cars listed in this category.</p>
                </div>
            </Container>
        );
    }

    // Category ka naam pehli ad se nikalna
    const categoryName = categoryAds[0]?.CategoryId?.Name || "Category Results";
    
    return (
        <div className="bg-light py-5 min-vh-100">
            <Container>
                <div className="mb-5 border-bottom pb-3">
                    <h1 className="display-5 fw-bold text-dark text-uppercase">{categoryName}</h1>
                    <p className="text-success fw-bold">Total Listings Found: {categoryAds.length}</p>
                </div>
                
                <Row className="g-4">
                    {categoryAds.map((item) => (
                        <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
                            <AdCard ad={item} /> 
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default CategoryAds;