import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { searchAds } from "../redux/slices/advertisementsSlice"; 
import './FormHandling.css';

const FormHandling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useSelector: Reference (Categories/Areas) aur Ads ki list store se mangwai hai
  const { categories, areas } = useSelector((state) => state.reference);
  const { list } = useSelector((state) => state.advertisment);

  // Local State: User jo type karega ya select karega wo yahan save hoga
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Debouncing Logic: Typing rukne ke 500ms baad search karega
  // Is se faida ye hai ke har ek lafz par server ko faltu request nahi jati
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.length > 1) {
        dispatch(searchAds({ keyword, category, area }));
        setShowDropdown(true); // Results milte hi dropdown khul jaye
      } else {
        setShowDropdown(false); // Agar text kam hai to dropdown band
      }
    }, 500);

    // Cleanup: Agar user dobara type kare to purana timer khatam kr deta hai
    return () => clearTimeout(delayDebounceFn);
  }, [keyword, category, area, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Browser ko reload hone se rokta hai
    setShowDropdown(false);
    
    // navigate: User ko Search results page par saaray filters ke sath bhej deta hai
    navigate(`/search?keyword=${keyword}&category=${category}&area=${area}`);
  };

  return (
    <section className="formhandling-section-wrapper" id="search-section">
      <Container>
        <Row className="formhandling-card shadow-lg g-0">
          <Col md={6} className="p-0">
            <img className="w-100 h-100 search-main-img" src="/bg.5.avif" alt="Search" />
          </Col>

          <Col md={6} className="p-4 formhandling-forBG text-white d-flex flex-column justify-content-center position-relative">
            <h3 className="mb-3">Find Your Perfect <span className="text-success-custom">Vehicle</span></h3>

            <Form onSubmit={handleSearchSubmit} className="position-relative">
              <Form.Group className="mb-2 position-relative">
                <Form.Label className="small fw-bold opacity-75">Keyword Search</Form.Label>
                
                <Form.Control 
                  className="search-input-custom" 
                  type="text" 
                  placeholder="Type to search (e.g. Civic, Toyota)..." 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Click allow karne ke liye delay
                  onFocus={() => keyword.length > 1 && setShowDropdown(true)}
                />

              
                    {/* // dropdown box create keya hai jo search ka necha related ads dhikyein */}
                {showDropdown && list && list.length > 0 && (
                  <div className="search-suggestions-dropdown shadow-lg">
                    {/* slice(0, 6): Sirf top 6 ads dikhayega taake list lambi na ho */}
                    {list.slice(0, 6).map((ad) => (
                      <div 
                        key={ad._id} 
                        className="suggestion-item d-flex align-items-center"
                        onClick={() => navigate(`/ad/${ad._id}`)} 
                      >
                        <img src={`http://localhost:3300/${ad.Images[0]}`} alt="car" className="suggestion-img me-2" />
                        <div>
                          <div className="suggestion-name text-dark fw-bold">{ad.Name}</div>
                       
                          <div className="suggestion-price text-success small">Rs {ad.Price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <Row className="g-2 mb-3">
                
                <Col xs={6}>
                  <Form.Select className="search-select-custom" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.Name}</option>)}
                  </Form.Select>
                </Col>
                
      
                <Col xs={6}>
                  <Form.Select className="search-select-custom" value={area} onChange={(e) => setArea(e.target.value)}>
                    <option value="">All Areas</option>
                    {areas.map(area => <option key={area._id} value={area._id}>{area.Name}</option>)}
                  </Form.Select>
                </Col>
              </Row>

              <Button type="submit" className="btn-search-premium w-100">
                SEARCH ALL INVENTORY <FontAwesomeIcon className="ms-2" icon={faMagnifyingGlass} />
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FormHandling;