import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../../../features/user/wishlistSlice";
import UserNav from "../UserNav";
import "./UserWishlist.css";

const FALLBACK_IMAGE =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function UserWishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector((state) => state.wishlist.items);

  return (
    <>
      <UserNav />

      <div className="wishlist-page">
        <h2>❤️ My Wishlist</h2>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <h3>Your wishlist is empty.</h3>
            <button onClick={() => navigate("/user/listings")}>
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <img src={item.image || FALLBACK_IMAGE} alt={item.name} />

                <div className="wishlist-content">
                  <h3>{item.name}</h3>

                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>

                  <p>
                    <strong>Price:</strong> ₹{item.price}
                  </p>

                  <div className="wishlist-buttons">
                    <button
                      onClick={() => navigate(`/user/listings/${item.id}`)}
                    >
                      View Details
                    </button>

                    <button
                      className="remove-btn"
                      onClick={() => dispatch(removeFromWishlist(item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default UserWishlist;
