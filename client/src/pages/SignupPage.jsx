import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Row, Col, Button, Form, Card } from 'react-bootstrap';
import { registerUser } from '../redux/slices/userSlice';
import ForgotPassword from '../component/ForgotPassword';

const SignupPage = () => {
    const [showForgotModal, setShowForgotModal] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.user);
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => { 
        if (token) navigate('/'); 
    }, [token, navigate]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("Name", data.Name);
        formData.append("Email", data.Email);
        formData.append("LoginID", data.LoginID);
        formData.append("Password", data.Password);
        formData.append("SecurityQuestion", data.SecurityQuestion);
        formData.append("SecurityAnswer", data.SecurityAnswer);
        formData.append("BirthDate", data.BirthDate);
        formData.append("ContactNumber", data.ContactNumber);

        if (data.profilePic && data.profilePic[0]) {
            formData.append("Image", data.profilePic[0]);
        }
        dispatch(registerUser(formData));
    };

    return (
        <>
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px'
            }}>
                <Card style={{
                    width: '100%',
                    maxWidth: '900px',
                    borderRadius: '15px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                    <Card.Body style={{ padding: '2.5rem' }}>
                        <h2 style={{ 
                            fontWeight: 'bold', 
                            textAlign: 'center', 
                            marginBottom: '0.5rem',
                            color: '#333'
                        }}>
                            Create Account
                        </h2>
                        <p style={{ 
                            textAlign: 'center', 
                            color: '#6c757d', 
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem'
                        }}>
                            Join PakClassified Marketplace
                        </p>
                        
                        {error && (
                            <div style={{
                                backgroundColor: '#f8d7da',
                                border: '1px solid #f5c6cb',
                                color: '#721c24',
                                padding: '0.5rem',
                                borderRadius: '5px',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Full Name
                                    </Form.Label>
                                    <Form.Control 
                                        {...register('Name', { required: "Name is required" })} 
                                        isInvalid={!!errors.Name} 
                                        placeholder="John Doe"
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.Name?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Email Address
                                    </Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        {...register('Email', { 
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })} 
                                        isInvalid={!!errors.Email}
                                        placeholder="example@email.com"
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.Email?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Unique Login ID
                                    </Form.Label>
                                    <Form.Control 
                                        {...register('LoginID', { required: "Login ID is required" })} 
                                        isInvalid={!!errors.LoginID}
                                        placeholder="johndoe123"
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.LoginID?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Password
                                    </Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        {...register('Password', { 
                                            required: "Password required", 
                                            minLength: {
                                                value: 6, 
                                                message: "Minimum 6 characters"
                                            } 
                                        })} 
                                        isInvalid={!!errors.Password}
                                        placeholder="••••••"
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.Password?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Security Question
                                    </Form.Label>
                                    <Form.Select 
                                        {...register('SecurityQuestion', { required: "Please select a question" })}
                                        isInvalid={!!errors.SecurityQuestion}
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    >
                                        <option value="">Select a question...</option>
                                        <option value="city">What is your birth city?</option>
                                        <option value="pet">What was your first pet's name?</option>
                                        <option value="school">What was the name of your first school?</option>
                                        <option value="car">What was your first car model?</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.SecurityQuestion?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Security Answer
                                    </Form.Label>
                                    <Form.Control 
                                        {...register('SecurityAnswer', { required: "Answer is required" })} 
                                        isInvalid={!!errors.SecurityAnswer}
                                        placeholder="Your answer"
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.SecurityAnswer?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Birth Date
                                    </Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        {...register('BirthDate', { required: "Birth date is required" })} 
                                        isInvalid={!!errors.BirthDate}
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.BirthDate?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={6} className="mb-3">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                        Contact Number
                                    </Form.Label>
                                    <Form.Control 
                                        placeholder="03XXXXXXXXX" 
                                        {...register('ContactNumber', { 
                                            required: "Contact number is required",
                                            pattern: {
                                                value: /^[0-9]{11}$/,
                                                message: "Enter 11-digit number"
                                            }
                                        })} 
                                        isInvalid={!!errors.ContactNumber}
                                        style={{
                                            border: '1.5px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '10px 15px'
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ContactNumber?.message}
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col md={12} className="mb-4">
                                    <Form.Label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#00bf63' }}>
                                        Profile Picture (Optional)
                                    </Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        accept="image/*" 
                                        {...register('profilePic')} 
                                        style={{
                                            padding: '8px',
                                            border: '1.5px dashed #00bf63',
                                            borderRadius: '8px',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                    />
                                    <Form.Text style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                        Upload JPG, PNG (Max 2MB)
                                    </Form.Text>
                                </Col>
                            </Row>
                            
                            <Button 
                                type="submit" 
                                style={{
                                    backgroundColor: '#00bf63',
                                    border: 'none',
                                    width: '100%',
                                    padding: '15px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                }}
                                disabled={loading}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#00994f';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#00bf63';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                {loading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                            </Button>
                        </Form>
                        
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                            Already a member?{' '}
                            <Link to="/login" style={{ color: '#00bf63', fontWeight: 'bold', textDecoration: 'none' }}>
                                Login
                            </Link>
                        </p>
                        
                        <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>
                            Forgot password?{' '}
                            <Button 
                                variant="link" 
                                style={{ 
                                    padding: 0, 
                                    color: '#00bf63', 
                                    textDecoration: 'none',
                                    fontSize: 'inherit',
                                    verticalAlign: 'baseline'
                                }}
                                onClick={() => setShowForgotModal(true)}
                            >
                                Reset here
                            </Button>
                        </p>
                    </Card.Body>
                </Card>
            </div>

            <ForgotPassword 
                show={showForgotModal} 
                handleClose={() => setShowForgotModal(false)} 
            />
        </>
    );
};

export default SignupPage;