import React, { useEffect, useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { searchAds } from '../redux/slices/advertisementsSlice';
import AdCard from '../component/AdCard';
import './SearchPage.css';

const selectAdsState = (state) => state.advertisment;

const SearchPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    
    const adsState = useSelector(selectAdsState);
    const list = adsState?.list || [];
    const loading = adsState?.loading || false;

    // URL se filters lena
    const keyword = searchParams.get('keyword')?.toLowerCase() || "";
    const category = searchParams.get('category') || "";
    const area = searchParams.get('area') || "";

    useEffect(() => {
        dispatch(searchAds({ keyword, category, area }));
    }, [dispatch, keyword, category, area]);

   
    const displayAds = useMemo(() => {
        if (!keyword && !category && !area) return list;

        return list.filter(ad => {
            const adTitle = ad.Name || ad.title || ""; 
            const adDesc = ad.Description || ad.description || "";

            const matchesKeyword = !keyword || 
                adTitle.toLowerCase().includes(keyword) || 
                adDesc.toLowerCase().includes(keyword);

            const matchesCategory = !category || 
                ad.CategoryId === category || 
                ad.CategoryId?._id === category;

            const matchesArea = !area || 
                ad.CityAreaId === area || 
                ad.CityAreaId?._id === area;

            return matchesKeyword && matchesCategory && matchesArea;
        });
    }, [list, keyword, category, area]);

    return (
        <div className="search-results-wrapper">
            <Container>
                <div className="search-title-section">
                    <h2>
                        Search Results for: <span className="text-success">"{keyword || 'All Ads'}"</span>
                    </h2>
                    <div className="results-info">
                        Found {displayAds.length} ads matching your criteria.
                    </div>
                </div>

                {loading && displayAds.length === 0 ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{color: '#00bf63'}} />
                        <p className="mt-3 text-muted">Searching the database...</p>
                    </div>
                ) : (
                    <Row className="g-4 search-results-grid">
                        {displayAds.length > 0 ? (
                            displayAds.map((ad) => (
                                <Col key={ad._id || ad.id} lg={3} md={4} sm={6}>
                                    <AdCard ad={ad} />
                                </Col>
                            ))
                        ) : (
                            <Col xs={12} className="text-center no-results-container">
                                <div className="py-5">
                                    <h3>Oops! No Ads Found 🚗</h3>
                                    <p className="text-muted">We didn't find any results for "{keyword}"</p>
                                    <p className="small text-secondary">Tip: Try searching with a broader keyword.</p>
                                </div>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default SearchPage;