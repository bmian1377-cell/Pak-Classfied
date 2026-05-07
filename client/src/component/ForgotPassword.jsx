import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Axios import kiya gaya hai
import './ForgotPassword.css';

const ForgotPassword = ({ show, handleClose }) => {
    const [currentView, setCurrentView] = useState('enter-email'); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = 'http://localhost:3300/api/v1/auth';

    // 1️⃣ Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const { data } = await axios.post(`${API_URL}/forgot-password`, { email });
            setSuccess(data.message);
            setCurrentView('enter-otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    // 2️⃣ Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const { data } = await axios.post(`${API_URL}/verify-otp`, { email, otp });
            setSuccess(data.message);
            setCurrentView('enter-password');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or Expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    // 3️⃣ Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setLoading(true); setError(''); setSuccess('');
        try {
            const { data } = await axios.post(`${API_URL}/reset-password`, { email, newPassword });
            setSuccess(data.message);
            setTimeout(() => {
                handleModalClose(); // 2 second baad modal band ho jayega
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    // Go back function
    const goBack = () => {
        if (currentView === 'enter-otp') setCurrentView('enter-email');
        if (currentView === 'enter-password') setCurrentView('enter-otp');
        setError(''); setSuccess('');
    };

    // Modal band hone par sab kuch reset kar dein
    const handleModalClose = () => {
        setCurrentView('enter-email');
        setEmail(''); setOtp(''); setNewPassword(''); setConfirmPassword('');
        setError(''); setSuccess('');
        handleClose();
    };

    // JSX Forms ko render karne wala function
    const renderView = () => {
        switch(currentView) {
            case 'enter-email':
                return (
                    <Form onSubmit={handleSendOTP}>
                        <p className="text-muted text-center mb-4">Enter your registered email to receive an OTP.</p>
                        <div className="forgot-input-group">
                            <FontAwesomeIcon icon={faEnvelope} className="forgot-input-icon" />
                            <Form.Control type="email" placeholder="Enter your email" className="forgot-input-field" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
                        </div>
                        <Button type="submit" className="forgot-btn-submit w-100" disabled={loading}>
                            {loading ? <><Spinner size="sm" /> Sending...</> : 'Send OTP'}
                        </Button>
                    </Form>
                );
            case 'enter-otp':
                return (
                    <Form onSubmit={handleVerifyOTP}>
                        <Button variant="link" className="p-0 mb-3 text-success" onClick={goBack} disabled={loading}><FontAwesomeIcon icon={faArrowLeft} /> Back</Button>
                        <p className="text-muted text-center mb-4">Enter the 6-digit OTP sent to <strong>{email}</strong></p>
                        <div className="forgot-input-group">
                            <FontAwesomeIcon icon={faKey} className="forgot-input-icon" />
                            <Form.Control type="text" placeholder="Enter 6-digit OTP" className="forgot-input-field" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={loading} maxLength={6} required />
                        </div>
                        <Button type="submit" className="forgot-btn-submit w-100" disabled={loading}>
                            {loading ? <><Spinner size="sm" /> Verifying...</> : 'Verify OTP'}
                        </Button>
                    </Form>
                );
            case 'enter-password':
                return (
                    <Form onSubmit={handleResetPassword}>
                        <p className="text-muted text-center mb-4">Create a new strong password.</p>
                        <div className="forgot-input-group">
                            <FontAwesomeIcon icon={faLock} className="forgot-input-icon" />
                            <Form.Control type="password" placeholder="New Password" className="forgot-input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} minLength={6} required />
                        </div>
                        <div className="forgot-input-group">
                            <FontAwesomeIcon icon={faLock} className="forgot-input-icon" />
                            <Form.Control type="password" placeholder="Confirm New Password" className="forgot-input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} minLength={6} required />
                        </div>
                        <Button type="submit" className="forgot-btn-submit w-100" disabled={loading}>
                            {loading ? <><Spinner size="sm" /> Resetting...</> : 'Reset Password'}
                        </Button>
                    </Form>
                );
            default: return null;
        }
    };

    return (
        <Modal show={show} onHide={handleModalClose} centered className="forgot-password-modal" backdrop="static">
            <Modal.Header closeButton className="forgot-modal-header">
                <Modal.Title className="forgot-modal-title">
                    <FontAwesomeIcon icon={faLock} className="me-2 text-success" />
                    Reset Your Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="forgot-modal-body">
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {success && !error && <Alert variant="success" className="text-center">{success}</Alert>}
                {renderView()}
            </Modal.Body>
        </Modal>
    );
};

export default ForgotPassword;