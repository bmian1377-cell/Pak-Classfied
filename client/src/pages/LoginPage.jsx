import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../redux/slices/userSlice';
import { Form, Button, Card } from 'react-bootstrap';
import ForgotPassword from '../component/ForgotPassword';

const LoginPage = () => {
    const [loginID, setLoginID] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotModal, setShowForgotModal] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.user);

    useEffect(() => { 
        if (token) navigate('/'); 
    }, [token, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser({ loginID, password }));
    };

    // Inline Styles
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        },
        card: {
            width: '100%',
            maxWidth: '450px',
            borderRadius: '15px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        },
        cardBody: {
            padding: '3rem 2.5rem'
        },
        title: {
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '0.5rem',
            color: '#333',
            fontSize: '2rem',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        subtitle: {
            textAlign: 'center',
            color: '#6c757d',
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
        },
        errorAlert: {
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500'
        },
        formLabel: {
            fontWeight: '600',
            marginBottom: '5px',
            color: '#495057',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            letterSpacing: '0.5px'
        },
        input: {
            border: '2px solid #e0e0e0',
            borderRadius: '10px',
            padding: '12px 15px',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
        },
        inputFocus: {
            borderColor: '#00bf63',
            boxShadow: '0 0 0 0.2rem rgba(0, 191, 99, 0.25)'
        },
        forgotLink: {
            color: '#00bf63',
            fontSize: '0.9rem',
            textDecoration: 'none',
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer'
        },
        loginButton: {
            background: 'linear-gradient(45deg, #00bf63, #00d4a0)',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            fontWeight: '700',
            fontSize: '1rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            width: '100%',
            color: 'white',
            transition: 'all 0.3s ease',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
        },
        signupText: {
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.95rem',
            color: '#495057'
        },
        signupLink: {
            color: '#00bf63',
            fontWeight: '700',
            textDecoration: 'none',
            marginLeft: '5px'
        },
        divider: {
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            margin: '20px 0',
            color: '#6c757d'
        },
        dividerLine: {
            flex: 1,
            height: '1px',
            background: '#e0e0e0'
        },
        dividerText: {
            padding: '0 10px',
            fontSize: '0.9rem'
        }
    };

    return (
        <>
            <div style={styles.container}>
                <Card style={styles.card}>
                    <Card.Body style={styles.cardBody}>
                        <h2 style={styles.title}>Welcome Back</h2>
                        <p style={styles.subtitle}>Log in to manage your listings</p>
                        
                        {error && (
                            <div style={styles.errorAlert}>
                                {error}
                            </div>
                        )}
                        
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.formLabel}>
                                    Login ID
                                </Form.Label>
                                <Form.Control 
                                    type="text"
                                    style={styles.input}
                                    placeholder="Enter your Login ID" 
                                    value={loginID} 
                                    onChange={(e) => setLoginID(e.target.value)} 
                                    required 
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#00bf63';
                                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 191, 99, 0.25)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-2">
                                <Form.Label style={styles.formLabel}>
                                    Password
                                </Form.Label>
                                <Form.Control 
                                    type="password" 
                                    style={styles.input}
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#00bf63';
                                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 191, 99, 0.25)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </Form.Group>

                            {/* Forgot Password Link */}
                            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                                <Button 
                                    variant="link" 
                                    style={styles.forgotLink}
                                    onClick={() => setShowForgotModal(true)}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#00994f';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '#00bf63';
                                    }}
                                >
                                    Forgot Password?
                                </Button>
                            </div>

                            <Button 
                                type="submit" 
                                style={styles.loginButton}
                                disabled={loading}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 10px 20px rgba(0, 191, 99, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Authenticating...
                                    </>
                                ) : 'LOG IN'}
                            </Button>

                            {/* Divider */}
                            <div style={styles.divider}>
                                <div style={styles.dividerLine}></div>
                                <span style={styles.dividerText}>or</span>
                                <div style={styles.dividerLine}></div>
                            </div>

                            {/* Sign Up Link */}
                            <p style={styles.signupText}>
                                Don't have an account?
                                <Link 
                                    to="/signup" 
                                    style={styles.signupLink}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#00994f';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '#00bf63';
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </Form>
                    </Card.Body>
                </Card>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPassword 
                show={showForgotModal} 
                handleClose={() => setShowForgotModal(false)} 
            />
        </>
    );
};

export default LoginPage;