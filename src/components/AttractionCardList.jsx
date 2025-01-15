import AttractionCard from "./AttractionCard";
import PropTypes from "prop-types";
import "../style/styles.css";

function AttractionCardList({ attractions, userLocation, handleCardClick }) {
  return (
    <div className="attractions-list">
      {attractions.map((attraction) => (
        <AttractionCard
          key={attraction.id}
          attraction={attraction}
          userLocation={userLocation}
          onClick={() => handleCardClick(attraction)}
        />
      ))}
    </div>
  );
}

export default AttractionCardList;
AttractionCardList.propTypes = {
  attractions: PropTypes.array.isRequired,
  userLocation: PropTypes.array,
  handleCardClick: PropTypes.func.isRequired,
};
