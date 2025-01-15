import { calculateDistance } from "../utils/utils";
import PropTypes from "prop-types";
import classNames from "classnames";
import "../style/styles.css";

function AttractionCard({ attraction, userLocation, onClick, isSelected }) {
  const distance = calculateDistance(userLocation, attraction);

  return (
    <div
      className={classNames("attraction-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer", { "selected-card": isSelected })}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
      <p className="text-gray-700 mb-4">{attraction.description || "No description available"}</p>
      <p className="text-gray-500">Distance: {distance} km</p>
    </div>
  );
}

export default AttractionCard;

AttractionCard.propTypes = {
  attraction: PropTypes.object.isRequired,
  userLocation: PropTypes.array,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
