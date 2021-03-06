import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/layout/Layout";
import styles from "../../../styles/Recommendation.module.css";
import { Container, Row, Col, Card, Image, Button, Modal, Spinner } from "react-bootstrap";
import Axios from "axios";
import { API_URL } from "../../../config/url";
import { toast } from "react-toastify";
import OtherTripList from "../../../components/OtherTrip";
import NoData from "../../../public/no-data.gif";
import { RiArrowRightCircleFill } from "react-icons/ri";
import { Formik, Form } from "formik";
import moment from "moment";
import Head from "next/head";
import PrivateRoutes from "../../../components/routes/PrivateRoutes";

function DetailRecommendationTrip({recommendationData, otherTripData}) {
	const router = useRouter();
	const { recommendationId } = router.query;
	const [dataOtherTrip, setDataOtherTrip] = useState([]);
	const [trip, setTrip] = useState({});
	const [spinner, setSpinner] = useState(false);

	// For Modal Operation
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// For Modal Operation

	const getRecommendationData = () => {
		setTrip({
			recomendation_id: recommendationData.recomendation_id,
			adminMainId: recommendationData.adminMainId,
			trip_image: API_URL + recommendationData.trip_image,
			destination: recommendationData.destination,
			description: recommendationData.description,
		})	
	}

	const getDataOtherTrip = () => {
		setSpinner(true)
		setDataOtherTrip(otherTripData)
		setTimeout(() => {
			setSpinner(false)
		}, 1500);
				
	};
	useEffect(() => {
		getRecommendationData()
		getDataOtherTrip();
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [recommendationId]);

	const OtherTrip = () => {
		if (spinner) {
			return (
				<Spinner animation="border" role="status" variant="info">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			);
		} else {
			if (dataOtherTrip.length > 0) {
				return (
					<>
						<OtherTripList data={dataOtherTrip} />
						<Link href="/trips">
							<div
								style={{
									textDecoration: "none",
									color: "#188CBD",
									fontSize: "20px",
									cursor: "pointer",
								}}
								className="float-end mt-3"
							>
								See Other
								<RiArrowRightCircleFill size={30} />
							</div>
						</Link>
					</>
				);
			} else {
				return <img className="img-fluid" style={{ width: "500px" }} src={NoData} alt="No-data" />;
			}
		}
	};

	return (
		<>
			<Head>
				<title>Our Recommendation in {trip.destination}</title>
				<meta name="keywords" content="travel travelling" />
			</Head>
			<PrivateRoutes>
				<Layout>
					<Container className={`${styles.detailtrip_container} py-5`}>
						<Row>
							<Col lg="5">
								<Card style={{ width: "100%" }}>
									<Image
										src={trip.trip_image}
										className={`img-fluid rounded shadow-4 ${styles.detail_trip_img}`}
										alt="..."
									/>
								</Card>
							</Col>
							<Col lg>
								<h1>{trip.destination}</h1>
								<div>
									<Row className="justify-content-start mx-0 my-4">
										<div className="p-0">
											<Button className="btn" variant="primary" onClick={handleShow} active>
												CREATE THIS TRIP
											</Button>
										</div>
									</Row>
								</div>
							</Col>
						</Row>
						<hr className="my-5" />
						<Row className="mb-3">
							<h3>Description</h3>
							<br />
							<p>{trip.description}</p>
						</Row>
						<Row className="mt-3">
							<Col lg="4">
								<h3>Posted By</h3>
								<div className={styles.posted}>
									<Image
										src={"https://cdn-icons-png.flaticon.com/512/147/147142.png"}
										className={`img-fluid rounded-circle shadow-4 ${styles.image_profile}`}
										alt="..."
									/>
									<div className="name-profile">
										<p className="mb-0">
											<b>Admin</b>
										</p>
									</div>
								</div>
							</Col>
						</Row>
						<hr className="my-5" />
						<Row>
							<div className={styles.other_trip}>
								<h2>READY TRIP</h2>
								<p>Trips made by the community</p>
							</div>
							<div className="text-center">{OtherTrip()}</div>
						</Row>
					</Container>
					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>CREATE THIS TRIP</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Formik
								initialValues={{
									trip_name: "",
									destination: trip.destination,
									start_date: "",
									end_date: "",
									max_member: "",
									description: trip.description,
									image: trip.trip_image,
								}}
								onSubmit={(values) => {
									if (values.max_member < 2) {
										toast.error("Max member must be minimal 2");
									} else if (values.start_date > values.end_date) {
										toast.error("Please input the right date");
									} else {
										Axios.post(`${API_URL}/trip/add_recommendation`, values)
											.then((response) => {
												console.log(response);
												setTimeout(() => {
													toast.success("Trip Successfully created!!");
												}, 500);
												router.push("/");
											})
											.catch((error) => {
												if (error.response) {
													toast.error(error.response.data.message);
												} else {
													toast.error("Cannot Connect to Server");
												}
											});
									}
								}}
							>
								{({ handleSubmit, handleChange }) => (
									<Form>
										<div className="form-group">
											<label htmlFor="tripname">Trip Name</label>
											<input
												type="text"
												className="form-control"
												id="tripname"
												name="trip_name"
												onChange={handleChange}
												required
											/>
										</div>
										<div className="form-group mt-3">
											<label htmlFor="startdate">Start Date</label>
											<input
												type="date"
												className="form-control"
												id="startdate"
												name="start_date"
												placeholder="Start Date"
												onChange={handleChange}
												required
												min={moment().add(1, "days").format("YYYY-MM-DD")}
											/>
										</div>
										<div className="form-group mt-3">
											<label htmlFor="enddate">End Date</label>
											<input
												type="date"
												className="form-control"
												id="enddate"
												name="end_date"
												placeholder="End Date"
												onChange={handleChange}
												required
												min={moment().add(1, "days").format("YYYY-MM-DD")}
											/>
										</div>
										<div className="form-group mt-3">
											<label htmlFor="maxmember">Max Member</label>
											<input
												type="number"
												className="form-control"
												id="maxmember"
												name="max_member"
												onChange={handleChange}
												required
											/>
										</div>
										<div className="btn-create">
											<button
												onClick={handleSubmit}
												type="submit"
												className="btn btn-primary w-100 mt-3"
											>
												Create Trip
											</button>
										</div>
									</Form>
								)}
							</Formik>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</Layout>
			</PrivateRoutes>
		</>
	);
}

export default DetailRecommendationTrip;

export const getServerSideProps = async (context) => {
	try {
		const {recommendationId} = context.params

		const dataRecommendation = await Axios.get(`${API_URL}/recomendation/detail/${recommendationId}`)
		const dataOtherTrip = await Axios.get(`${API_URL}/trip/other_trip/${recommendationId}`)

		return {
			props: {
				recommendationData : dataRecommendation.data.data,
				otherTripData : dataOtherTrip.data.data
			}
		}
	} catch (error) {
		console.log(error)
		return {
			props: {
				tripData : {},
				otherTripData : {}
			}
		}
	}
}
