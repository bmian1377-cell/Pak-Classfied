import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUser, faLock, faIdCard, faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SettingsPage.css';


const BACKEND_URL = "http://localhost:3300";

const SettingsPage = () => {
    // redux store sy user ki current information lyein ga hm
    const { user, token } = useSelector(state => state.user);
    
   // set spinner on 3 different properties
    const [loading, setLoading] = useState({ profile: false, photo: false, security: false });
    
    //state for input edits
    const [name, setName] = useState(user?.Name || "");
    const [contact, setContact] = useState(user?.ContactNumber || "");
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" }); 


    const [imageFile, setImageFile] = useState(null); // Backend bhejne ke liye asli file
    const [imagePreview, setImagePreview] = useState(null); // Screen par dikhane ke liye temporary URL
  

    //image path fix 
    const getImg = (p) =>
         p?.startsWith('http') 
             ? p : (p ? `${BACKEND_URL}/${p.replace(/\\/g, "/")}` 
         : "/default_profile.png");

    // update function => edit pr data change krein hr jaga
    const updateAndRefresh = (newData) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        //sending the data
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...newData }));
        setTimeout(() => window.location.reload(), 2000); 
    };

    //profile change function
    const handlePhotoUpdate = async () => {
        if (!imageFile) return toast.info("select the new Phtot");
        
        setLoading(prev => ({ ...prev, photo: true })); 
        const formData = new FormData(); 
        formData.append('Image', imageFile);

        try {
            const res = await axios.put(`${BACKEND_URL}/api/v1/auth/update-me`,
                 formData,
                  {
                headers:
                 { "Authorization": `Bearer ${token}`,
                  "Content-Type": "multipart/form-data"
                 }
            });
            if (res.data.success) {
                toast.success("Profile Photo updated successfully! 📸");
                updateAndRefresh(res.data.user);
            }
        } catch (err) {
            toast.error("Photo upload failed. Server error!");
        } finally {
            setLoading(prev => ({ ...prev, photo: false })); 
        }
    };

    //Name aur Contact Number Edit function
    const handleProfileUpdate = async (e) => {
        e.preventDefault(); 
        setLoading(prev => ({ ...prev, profile: true }));
        try {
            const res = await axios.put(`${BACKEND_URL}/api/v1/auth/update-me`, 
                { Name: name, ContactNumber: contact }, 
                {
                headers: { 
                    "Authorization": `Bearer ${token}`
                      }
            });
            if (res.data.success) {
                toast.success("Personal Information updated! ✅");
                updateAndRefresh(res.data.user);
            }
        } catch (err) {
            toast.error("Failed to update profile details.");
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    // Password change function
    const handleSecurityUpdate = async (e) => {
        e.preventDefault();
        // Validation: Check karna ke khali fields na hon aur naya password match ho raha ho
        if (!passwords.current || !passwords.new) return toast.error("please Enter the current or new Password!");
        if (passwords.new !== passwords.confirm) return toast.error("Confirm password match nahi ho raha!");

        setLoading(prev => ({ ...prev, security: true })); // Security spinner start
        try {
            const res = await axios.put(`${BACKEND_URL}/api/v1/auth/update-me`, 
                { currentPassword: passwords.current, newPassword: passwords.new }, 
                { headers: {
                     "Authorization": `Bearer ${token}` 
                    }}
            );
            if (res.data.success) {
                toast.success("Password changed successfully! 🔐");
                setPasswords({ current: "", new: "", confirm: "" }); 
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Password update failed!");
        } finally {
            setLoading(prev => ({ ...prev, security: false }));
        }
    };

    return (
        <div className="settings-page-wrapper pb-5">
            <ToastContainer position="top-right" theme="colored" />
            
          
            <section className="settings-hero-banner shadow mb-5">
                <Container>
                    <h2 className="fw-bold m-0"><span className="brand-badge">PAK</span> ACCOUNT SETTINGS</h2>
                </Container>
            </section>

            <Container>
                <Row className="g-4">
                    {/* left side proilfe card part */}
                    <Col lg={4}>
                        <Card className="settings-card text-center p-4">
                            <h5 className="fw-bold mb-4 section-label"><FontAwesomeIcon icon={faCamera} className="me-2 text-success"/>Profile Photo</h5>
                            <div className="avatar-edit-wrapper mx-auto mb-3">
                                <img src={imagePreview || getImg(user?.Image)} alt="Profile" />
                                <label className="avatar-overlay-btn" title="Choose Photo">
                                    <FontAwesomeIcon icon={faCamera} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if(file){
                                            setImageFile(file); 
                                            setImagePreview(URL.createObjectURL(file));   //=> URL.createObjectURL using for demi url create or browser because they does not allow tu acees our local/desktop access
                                        }
                                    }} />
                                </label>
                            </div>
                            <Button 
                                variant="success" 
                                className="w-100 btn-save-pro" 
                                onClick={handlePhotoUpdate} 
                                disabled={loading.photo || !imageFile} // Jab tak photo select na ho button band rahega
                            >
                                {loading.photo ? <Spinner size="sm"/> : "Update Image"}
                            </Button>
                        </Card>

                       
                        <Card className="settings-card p-4 mt-4 bg-light border-0">
                            <h6 className="fw-bold text-muted mb-3"><FontAwesomeIcon icon={faIdCard} className="me-2"/>System Identity</h6>
                            <div className="id-box">
                                <small className="d-block text-muted">LOGIN ID</small>
                                <p className="fw-bold m-0">{user?.LoginID}</p>
                            </div>
                            <div className="id-box mt-3">
                                <small className="d-block text-muted">REGISTERED EMAIL</small>
                                <p className="fw-bold m-0 text-truncate">{user?.Email}</p>
                            </div>
                        </Card>
                    </Col>




                    {/* right side part */}
                    <Col lg={8}>
                        {/* Personal Details Form */}
                        <Card className="settings-card p-4 mb-4">
                            <h5 className="fw-bold mb-4 section-label"><FontAwesomeIcon icon={faUser} className="me-2 text-success"/>Personal Details</h5>
                            <Form onSubmit={handleProfileUpdate}>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="small fw-bold">FULL NAME</Form.Label>
                                        <Form.Control value={name} onChange={(e) => setName(e.target.value)} className="settings-input-custom" required />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="small fw-bold">CONTACT NUMBER</Form.Label>
                                        <Form.Control value={contact} onChange={(e) => setContact(e.target.value)} className="settings-input-custom" required />
                                    </Col>
                                </Row>
                                <Button type="submit" variant="dark" className="btn-save-pro" disabled={loading.profile}>
                                    {loading.profile ? <Spinner size="sm"/> : <><FontAwesomeIcon icon={faSave} className="me-2"/>Save Information</>}
                                </Button>
                            </Form>
                        </Card>

                     

                        {/* password input part */}
                        <Card className="settings-card p-4 security-card shadow-sm">
                            <h5 className="fw-bold mb-4 text-danger section-label"><FontAwesomeIcon icon={faLock} className="me-2"/>Account Security</h5>
                            <Form onSubmit={handleSecurityUpdate}>
                                <div className="mb-4 current-pass-box">
                                    <Form.Label className="small fw-bold text-danger">VERIFY CURRENT PASSWORD</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Type current password to change" 
                                        className="settings-input-custom border-danger"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    />
                                </div>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="small fw-bold">NEW PASSWORD</Form.Label>
                                        <Form.Control 
                                            type="password" 
                                            placeholder="Minimum 6 characters"
                                            className="settings-input-custom"
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="small fw-bold">CONFIRM PASSWORD</Form.Label>
                                        <Form.Control 
                                            type="password" 
                                            className="settings-input-custom"
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                        />
                                    </Col>
                                </Row>
                                <Button type="submit" variant="danger" className="btn-save-pro w-100 mt-2" disabled={loading.security}>
                                    {loading.security ? <Spinner size="sm"/> : "Change My Password"}
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SettingsPage;