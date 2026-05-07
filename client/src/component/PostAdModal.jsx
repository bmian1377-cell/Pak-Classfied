import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchReferenceData } from "../features/reference/refernceSlice";
import { fetchMyAds } from "../redux/slices/advertisementsSlice"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faMoneyBillWave, faMapMarkerAlt, faCalendarAlt, faPlus, faCheckCircle, faSave, faEdit, faImage } from '@fortawesome/free-solid-svg-icons';
import './PostAdModal.css';

const PostAdModal = ({ show, handleClose, isEdit = false, adData = null }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { categories, areas, statuses, loading } = useSelector((state) => state.reference);
  const [isPosting, setIsPosting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (show) {
      if (isEdit && adData) {
        const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : "";
        reset({
          name: adData.Name,
          description: adData.Description,
          price: adData.Price,
          features: adData.Features,
          startsOn: formatDate(adData.StartsOn),
          endsOn: formatDate(adData.EndsOn),
          category: adData.CategoryId?._id || adData.CategoryId,
          area: adData.CityAreaId?._id || adData.CityAreaId,
          status: adData.StatusId?._id || adData.StatusId,
        });
      } else {
        reset({ name: "", description: "", price: "", features: "", startsOn: "", endsOn: "", category: "", area: "", status: "" });
      }
    }
  }, [show, isEdit, adData, reset]);

const onSubmit = async (data) => {
    if (!token) return toast.error("Unauthorized! Please login.");
    setIsPosting(true);

    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("Price", data.price);
    formData.append("Features", data.features);
    formData.append("StartsOn", data.startsOn);
    formData.append("EndsOn", data.endsOn);
    formData.append("CategoryId", data.category);
    formData.append("CityAreaId", data.area);
    formData.append("StatusId", data.status);


    //using array because image saving issue on backend
    if (data.imageFile && data.imageFile.length > 0) {
    Array.from(data.imageFile).forEach((file) => {
        formData.append("Images", file); 
    });
}

    try {
        const url = isEdit
            ? `http://localhost:3300/api/v1/advertisment/${adData._id}`
            : `http://localhost:3300/api/v1/advertisment`;

        const method = isEdit ? 'put' : 'post';

        const res = await axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 200 || res.status === 201) {
            toast.success(isEdit ? "Ad Updated!" : "Ad Published!");
            dispatch(fetchMyAds());
            handleClose();
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
        setIsPosting(false);
    }
};

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered contentClassName="post-ad-modal-content">
      <Modal.Header closeButton className="post-ad-header text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={isEdit ? faEdit : faPlus} className="me-2 text-success" />
          {isEdit ? "Edit Advertisement" : "Publish Advertisement"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 p-md-5 post-ad-form">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section-title"><FontAwesomeIcon icon={faInfoCircle} className="me-2" /> Vehicle Information</div>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Ad Title</Form.Label>
              <Form.Control placeholder="e.g. Honda Civic 2022" {...register("name", { required: "Required" })} />
              {errors.name && <span className="text-danger small">{errors.name.message}</span>}
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Mileage, Condition, etc." {...register("description", { required: "Required" })} />
            </Col>
          </Row>

          <div className="form-section-title"><FontAwesomeIcon icon={faMoneyBillWave} className="me-2" /> Price & Features</div>
          <Row>
            <Col md={6} className="mb-3">
                <Form.Label>Price (PKR)</Form.Label>
                <Form.Control type="number" {...register("price", { required: "Required" })} />
            </Col>
            <Col md={6} className="mb-3">
                <Form.Label>Key Features</Form.Label>
                <Form.Control placeholder="Sunroof, ABS, Alloys" {...register("features", { required: "Required" })} />
                {errors.features && <span className="text-danger small">Features are required</span>}
            </Col>
          </Row>

          <div className="form-section-title"><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> Location & Category</div>
          <Row>
            <Col md={4} className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select {...register("category", { required: true })}>
                  <option value="">Select</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.Name}</option>)}
                </Form.Select>
            </Col>
            <Col md={4} className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Select {...register("area", { required: true })}>
                  <option value="">Select</option>
                  {areas.map(a => <option key={a._id} value={a._id}>{a.Name}</option>)}
                </Form.Select>
            </Col>
            <Col md={4} className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select {...register("status", { required: true })}>
                  <option value="">Select</option>
                  {statuses.map(s => <option key={s._id} value={s._id}>{s.Name}</option>)}
                </Form.Select>
            </Col>
          </Row>

          <div className="form-section-title"><FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> Schedule & Media</div>
          <Row>
             <Col md={6} className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" {...register("startsOn", { required: true })} />
             </Col>
             <Col md={6} className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" {...register("endsOn", { required: true })} />
             </Col>
             <Col md={12} className="mb-3">
                <Form.Label className="text-success fw-bold"><FontAwesomeIcon icon={faImage} /> Upload Car Photo</Form.Label>
                <Form.Control type="file" accept="image/*" {...register("imageFile")}  multiple />
             </Col>
          </Row>

          <Button type="submit" className="btn-submit-ad-premium w-100 mt-4 shadow" disabled={isPosting}>
            {isPosting ? <Spinner size="sm" /> : <FontAwesomeIcon icon={isEdit ? faSave : faCheckCircle} />}
            {isEdit ? " SAVE CHANGES" : " PUBLISH AD NOW"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PostAdModal;