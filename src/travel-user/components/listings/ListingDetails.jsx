import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserNav from "../UserNav";
import "./ListingDetails.css";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";

const FALLBACK_IMAGE =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${DB_URL}/listings/${id}.json`);

        if (res.data) {
          setListing({
            id,
            ...res.data,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!listing) {
    return <h2 style={{ textAlign: "center" }}>Listing Not Found</h2>;
  }

  return (
    <>
      <UserNav />

      <div className="listing-details-container">
        <img
          src={listing.image || FALLBACK_IMAGE}
          alt={listing.name}
          className="listing-image"
        />

        <div className="listing-content">
          <h1>{listing.name}</h1>

          <p>
            <strong>Category:</strong> {listing.category}
          </p>

          <p>
            <strong>Address:</strong> {listing.address}
          </p>

          <p>
            <strong>Price:</strong> ₹{listing.price}/night
          </p>

          <p>{listing.description}</p>

          <p>
            <strong>Status:</strong>{" "}
            {listing.available ? "Available ✅" : "Not Available ❌"}
          </p>

          <div className="details-buttons">
            <button type="button" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <button type="button" onClick={() => navigate("/user/listings")}>
              Browse More
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListingDetails;
