import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { toast } from "react-toastify";
import './Contact.css';

const Contact = () => {
  // 1. Form State for complain query  form 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);

  // 2. Input Change Handler for complain qquery form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend URL check karlein (localhost:3300 hi hai na?)
      const response = await axios.post("http://localhost:3300/api/v1/contact/submit", formData);
      
      if (response.data.success) {
        toast.success("Thank you! Your query has been sent to our team.");
        setFormData({ name: "", email: "", subject: "", message: "" }); // Form clear karna
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
      //why i am not use React hook form for this form ?
   //"Chota form hone ki wajah se maine Controlled Components use kiye taake extra library (RHF) ke baghair 
   //bundle size kam rahe aur direct state control se real-time validation asan ho."





  return (
    <div className="contact-page-wrapper bg-light">
      <section className="contact-hero-section text-white">
        <Container>
          <Row className="py-5">
            <Col md={8} lg={6} className="mt-5"> 
              <h1 className="display-4 fw-bold mb-3">Get In Touch</h1>
              <p className="fs-5 text-light opacity-75">
                Have a specific car in mind or need help with a listing? Our team is ready to assist you.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      
      <section className="address-section-offset">
        <Container>
          <Row className="g-4"> 
            {[
              { icon: faMapMarkerAlt, title: "Our Location", detail: "Gulberg III, Lahore" },
              { icon: faEnvelope, title: "Email Us", detail: "support@pakclassified.com" },
              { icon: faPhone, title: "Call Anytime", detail: "0300 1 387 387" }
            ].map((item, idx) => (
              <Col key={idx} xs={12} md={4}>
                <Card className="contact-info-card border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="contact-icon-circle mb-3"><FontAwesomeIcon icon={item.icon} /></div>
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-muted mb-0">{item.detail}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 my-5">
        <Container>
          <Row className="g-5 align-items-stretch"> 
            <Col lg={6}>
              <div className="shadow-sm rounded-4 overflow-hidden h-100">
                <iframe 
                  title="Map" 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.3259838032484!2d74.34149237531778!3d31.51518104752528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a281eb811%3A0x42966141443c42!2sGulberg%20III%2C%20Lahore%2C%20Punjab!5e0!3m2!1sen!2spk!4v1709500000000!5m2!1sen!2spk" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '400px' }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
            <Col lg={6}>
              <div className="contact-form-card p-5 text-white shadow-lg">
                <h3 className="fw-bold mb-4">Contact For Query</h3>
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Control 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name" 
                        className="contact-input" 
                        required 
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email" 
                        className="contact-input" 
                        required 
                      />
                    </Col>
                    <Col xs={12}>
                      <Form.Control 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject" 
                        className="contact-input" 
                        required 
                      />
                    </Col>
                    <Col xs={12}>
                      <Form.Control 
                        name="message"
                        as="textarea" 
                        rows={4} 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your query or complain here..." 
                        className="contact-input" 
                        required 
                      />
                    </Col>
                    <Col xs={12}>
                      <Button 
                        variant="success" 
                        type="submit"
                        disabled={loading}
                        className="w-100 py-3 btn-contact-submit fw-bold"
                      >
                        {loading ? <Spinner size="sm" /> : "SEND MESSAGE"} 
                        {!loading && <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;