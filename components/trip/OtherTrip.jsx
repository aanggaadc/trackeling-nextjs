import Link from 'next/link'
import styles from './OtherTrip.module.css'
import { Col, Card, Button, Row, ProgressBar } from "react-bootstrap";
import { API_URL } from "../../config/url";

function OtherTrip({ data }) {
  return (
    <div className="container p-0">
      <Row xs={1} md={2} lg={4} className="g-2">
        {data.map((item, index) => (
          <Col key={index}>
            <Card className="text-center shadow h-100">
              <div className={styles.card_trip}>
                <Card.Img variant="top" src={`${API_URL}/${item.trip_image}`} className={styles.card_imgTrip} />
              </div>
              <Card.Body>
                <Card.Title>
                  <h3 style={{ fontWeight: "Bold" }}>{item.trip_name}</h3>
                </Card.Title>
                <Card.Text>
                  <h4>{item.destination}</h4>
                  <p>
                    {item.start_date} to {item.end_date}
                  </p>
                </Card.Text>
                <ProgressBar variant="info" now={Math.ceil((item.count_member * 100) / item.max_member)} label={`${item.count_member}/${item.max_member}`} />
                <Link href={`/trip/detail/${item.trip_id}`}>
                  <Button className={`mt-2 ${styles.trip_button}`}>Detail</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default OtherTrip;