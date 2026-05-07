import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Image,
  Modal,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyAds } from "../redux/slices/advertisementsSlice";
import { Link } from "react-router-dom";
import PostAdModal from "../component/PostAdModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faLocationDot,
  faCircleExclamation,
  faGear,
  faStar,
  faHashtag,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import "./UserProfile.css";

const BACKEND_URL = "http://localhost:3300";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);
  const { userAds, loading } = useSelector((state) => state.advertisment);

  const [showAdEdit, setShowAdEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [selectedAd, setSelectedAd] = useState(null); // ya state is leya ka sirf select ad pr CRUD perform ho

  useEffect(() => {
    dispatch(fetchMyAds());
  }, [dispatch]);


  //Ad edit function
  const handleEditClick = (ad) => {
    setSelectedAd(ad);
    setShowAdEdit(true);
  };
  const getImg = (p) =>
    p?.startsWith("http") ? p : `${BACKEND_URL}/${p?.replace(/\\/g, "/")}`;


  // Ad Delete function
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/v1/advertisment/${selectedAd._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Listing Deleted Successfully");
      setShowDeleteModal(false);
      dispatch(fetchMyAds());
    } catch (err) {
      toast.error("Action Failed");
    }
  };

 // idhr hm status ka mutabik star badge ko color dyein ga 
  const getStatusStyle = (statusName) => {
    const name = statusName?.toLowerCase();
    if (name === "sold") return "bg-danger text-white"; 
    if (name === "pending") return "bg-warning text-dark"; 
    return "bg-success text-white";
  };

  return (
    <div className="dashboard-wrapper pb-5">
  
      <section className="dashboard-header-large shadow">
        <Container>
          <div className="mb-3">
            <span className="brand-pak-badge">PAK</span>
         
            <span className="header-title-text">CLASSIFIEDS DASHBOARD</span>
          </div>
          <p className="fs-5 opacity-75 text-white-50">
            Manage your premium listings and showroom performance.
          </p>
        </Container>
      </section>


     {/* //Profile Card part */}
      <Container className="mt-n5">
        <Row>
         
          <Col lg={3} className="mb-4">
            <div className="sticky-sidebar-container">
              <Card className="user-identity-card shadow-lg border-0">
                <div className="user-card-deco-header"></div>
                <div className="text-center">
                  <Image
                    src={getImg(user?.Image)}
                    roundedCircle
                    className="profile-avatar-pro"
                  />
                  <h4 className="fw-bold mt-2 text-dark mb-0">{user?.Name}</h4>
                  <small className="text-success fw-bold uppercase letter-spacing-1">
                    Verified Member
                  </small>
                </div>
                <div className="p-4 pt-2">
                  <div className="ads-count-box shadow-sm">
                    <div className="info-label">Total Listings</div>
                    <div className="fs-4 fw-bold text-dark">
                      <FontAwesomeIcon
                        icon={faHashtag}
                        className="me-2 text-success"
                      />
                      {userAds?.length || 0}
                    </div>
                  </div>
                  <div className="info-label">Email Handle</div>
                  <div className="info-value text-truncate">{user?.Email}</div>
                  <div className="info-label">Contact Line</div>
                  <div className="info-value">
                    {user?.ContactNumber || user?.contactNumber || "Not Linked"}
                  </div>
                  <Link to="/settings">
                    <Button
                      variant="dark"
                      className="w-100 fw-bold border-2 border-success text-success mt-2"
                    >
                      <FontAwesomeIcon icon={faGear} className="me-2" /> ACCOUNT
                      SETTINGS
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </Col>

         {/* // AD Card Part */}
          <Col lg={9}>
          
            <h4 className="fw-bold mb-4 uppercase text-dark border-start border-success border-4 ps-3">
              My Posted Advertisements
            </h4>
            {loading === "pending" ? (
              <div className="text-center py-5">
                <Spinner variant="success" />
              </div>
            ) : (
              userAds?.map((ad) => (
                <Card
                  key={ad._id}
                  className="showroom-card-pro border-0 shadow-sm mb-5"
                >
             
                  <div className="ad-visual-70">
                 
                    <div
                        // status color changed function calling
                      className={`status-star-badge ${getStatusStyle(ad.StatusId?.Name)} shadow`}
                    >
                     {ad.StatusId?.Name || "Active"}
                    </div>
                    <div className="price-badge-top-right shadow">
                      PKR {ad.Price?.toLocaleString()}
                    </div>
                    <Card.Img
                      src={getImg(ad.Images?.[0] || ad.Image)}
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </div>

                   {/* Ad info  */}
                  <div
                    className={`ad-info-30 p-4 ${ad.StatusId?.Name === "Sold" ? "bg-sold-gray" : ""}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Link
                          to={`/ad/${ad._id}`}
                          className="text-decoration-none text-dark"
                        >
                          <h2 className="fw-bold mb-1">{ad.Name}</h2>
                        </Link>
                        <p className="text-muted small m-0 d-flex gap-3 align-items-center">
                          <span>
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              className="text-success me-1"
                            />{" "}
                            {ad.CityAreaId?.Name}
                          </span>
                          <span>
                            <FontAwesomeIcon
                              icon={faImage}
                              className="text-secondary me-1"
                            />{" "}
                            {ad.Images?.length || 0} Photos
                          </span>
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-dark"
                          className="btn-manage-sleek"
                          onClick={() => handleEditClick(ad)}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="danger"
                          className="btn-manage-sleek shadow"
                          onClick={() => {
                            setSelectedAd(ad);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>

      <PostAdModal
        show={showAdEdit}
        handleClose={() => setShowAdEdit(false)}
        isEdit={true}
        adData={selectedAd}
      />
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        size="sm"
      >
        <Modal.Body className="text-center p-4 bg-dark text-white rounded border border-danger">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            size="3x"
            className="text-danger mb-3"
          />
          <h5 className="fw-bold">Delete Permanent?</h5>
          <div className="d-flex gap-2 mt-4">
            <Button
              variant="secondary"
              className="w-100 btn-sm"
              onClick={() => setShowDeleteModal(false)}
            >
              No
            </Button>
            <Button
              variant="danger"
              className="w-100 btn-sm fw-bold"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default UserProfile;
