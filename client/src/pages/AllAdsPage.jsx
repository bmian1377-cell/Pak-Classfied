import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdvertisments } from '../redux/slices/advertisementsSlice'; 
import AdCard from '../component/AdCard';

const AllAdsPage = () => {
    const dispatch = useDispatch();
    
    
    const { list, loading } = useSelector((state) => state.advertisment);

    useEffect(() => {
        dispatch(fetchAdvertisments({ isLatest: false })); 
    }, [dispatch]);

    return (
        <Container className="py-5 min-vh-100">
            <h2 className="fw-bold mb-4">All <span className="text-success">Advertisements</span></h2>
            
            {loading === 'pending' ? (
                <div className="text-center py-5">
                    <Spinner variant="success" animation="border" />
                </div>
            ) : (
                <Row className="g-4">
                  
                    {list && list.length > 0 ? (
                        list.map((ad) => (
                            <Col key={ad._id} xs={12} sm={6} md={4} lg={3}>
                                <AdCard ad={ad} />
                            </Col>
                        ))
                    ) : (
                        <div className="text-center w-100 py-5">
                            <p className="text-muted">No advertisements found.</p>
                        </div>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default AllAdsPage;