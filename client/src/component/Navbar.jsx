import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Button, Image, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PostAdModal from "./PostAdModal";
import { useSelector, useDispatch } from "react-redux";
import { fetchReferenceData } from "../features/reference/refernceSlice";
import { logout } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faChartLine, faUserCog, faSignOutAlt, faPlus, faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const BACKEND_URL = "http://localhost:3300";

const AppNavbar = () => {
    const [showPost, setShowPost] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, token } = useSelector((state) => state.user);
    const { categories, loading } = useSelector((state) => state.reference);

    useEffect(() => {
        if (categories.length === 0 && !loading) {
            dispatch(fetchReferenceData());
        }
    }, [dispatch, categories.length, loading]);

    const closeMenu = () => setExpanded(false);

    const handleLogout = () => {
        dispatch(logout());
        setShowLogoutConfirm(false);
        closeMenu();
        toast.info("Logged out successfully");
        navigate("/login");
    };
    
    const userImg = user?.Image 
        ? (user.Image.startsWith("http") ? user.Image : `${BACKEND_URL}/${user.Image.replace(/\\/g, "/")}`)
        : "/default_profile.png";

    return (
        <>
            <Navbar 
                expand="lg" 
                className="Navbar-one shadow" 
                sticky="top" 
                variant="dark"
                expanded={expanded}
                onToggle={(val) => setExpanded(val)}
            >
                <Container>
                    <Navbar.Toggle aria-controls="main-nav" className="order-0 border-0" />
                    <Navbar.Brand as={Link} to="/" onClick={closeMenu} className="order-1 logo-brand-custom">
                        <span className="brand-pak">PAK</span><span className="brand-classified">CLASSIFIED</span>
                    </Navbar.Brand>

                    <div className="order-2 order-lg-last d-flex align-items-center ms-lg-3">
                        {token ? (
                            // Agar user login hai toh Profile ka icon dikhao
                            <NavDropdown 
                                align="end"
                                className="custom-bg-dropdown profile-trigger"
                                title={<Image src={userImg} roundedCircle className="nav-profile-pic shadow" />}
                            >
                                <div className="user-label-nav">{user?.Name}</div>
                                <NavDropdown.Item as={Link} to="/profile" onClick={closeMenu} className="dropdown-item-flex">
                                    <span><FontAwesomeIcon icon={faChartLine} className="me-2 text-success" /> Dashboard</span>
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/settings" onClick={closeMenu} className="dropdown-item-flex">
                                    <span><FontAwesomeIcon icon={faUserCog} className="me-2 text-success" /> Settings</span>
                                </NavDropdown.Item>
                                <NavDropdown.Divider className="bg-secondary m-0" />
                                <NavDropdown.Item onClick={() => {setShowLogoutConfirm(true); closeMenu();}} className="dropdown-item-flex text-danger">
                                    <span><FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout</span>
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            // Agar user login nahi hai toh Mobile par LOGIN button dikhao
                            <Link to="/login" onClick={closeMenu} className="btn btn-outline-light btn-sm fw-bold px-3 d-lg-none">LOGIN</Link>
                        )}
                    </div>

                    <Navbar.Collapse id="main-nav" className="order-3">
                        <div className="d-lg-none d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
                            <span className="text-success fw-bold small">MENU</span>
                            <FontAwesomeIcon icon={faXmark} size="xl" className="text-white" onClick={closeMenu} />
                        </div>

                        <Nav className="nav-center-links mx-auto text-center align-items-center">
                            <Nav.Link as={Link} to="/" onClick={closeMenu} className="nav-link-style">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about" onClick={closeMenu} className="nav-link-style">About</Nav.Link>
                            <NavDropdown 
                                title={<span>CATEGORIES <FontAwesomeIcon icon={faChevronDown} className="ms-1 d-lg-none" style={{fontSize: '0.8rem'}} /></span>} 
                                className="nav-link-style custom-bg-dropdown"
                            >
                                {categories.map((cat) => (
                                    <NavDropdown.Item key={cat._id} as={Link} to={`/category/${cat._id}`} onClick={closeMenu} className="dropdown-item-flex">
                                        <span><FontAwesomeIcon icon={faCar} className="me-2 text-success small" /> {cat.Name}</span>
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                            <Nav.Link as={Link} to="/contact" onClick={closeMenu} className="nav-link-style">Contact</Nav.Link>
                        </Nav>

                        <div className="text-center mt-4 mt-lg-0">
                            {token ? (
                                // Agar user login hai, toh "Post Ad" button dikhao
                                <Button onClick={() => {setShowPost(true); closeMenu();}} variant="success" className="fw-bold px-4 btn-post-ad-nav">
                                    <FontAwesomeIcon icon={faPlus} className="me-2 d-lg-none" /> POST ADVERTISEMENT
                                </Button>
                            ) : (
                                // Agar login nahi hai, toh Desktop par "Login/Signup" buttons dikhao
                                <div className="d-lg-flex gap-2 d-none">
                                    <Button as={Link} to="/login" variant="outline-light">Login</Button>
                                    <Button as={Link} to="/signup" variant="success">Sign Up</Button>
                                </div>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {token && <PostAdModal show={showPost} handleClose={() => setShowPost(false)} />}

            <Modal show={showLogoutConfirm} onHide={() => setShowLogoutConfirm(false)} centered size="sm">
                <Modal.Body className="text-center p-4 bg-dark text-white rounded border border-secondary">
                    <p className="fw-bold mb-4">Are you sure you want to logout?</p>
                    <div className="d-flex gap-2">
                        <Button variant="secondary" className="w-100 btn-sm" onClick={() => setShowLogoutConfirm(false)}>Stay</Button>
                        <Button variant="danger" className="w-100 btn-sm fw-bold" onClick={handleLogout}>Logout</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AppNavbar;