import React from "react";
import { useNavigate } from 'react-router-dom';
import "./css/App.css";

const PlatformCard = ({ platform }) => {
  const navigate = useNavigate();

  // platform click funcionality
  const handlePlat = (platformName) => {
    navigate(`/platform/${platformName.replace(/\s+/g, '__')}`);
  };

  return (
    <div className="platform" onClick={() => handlePlat(platform.Platform_name)} key={platform.Platform_ID}>
      <img className="platform-icon" src={`/platform/${platform.Plat_icon_fp}`} alt={`${platform.Platform_name} cover art`} />
      <h2>{platform.Platform_name}</h2>
    </div>
  );
};

export default PlatformCard;
