import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BenefitDetail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Since there are no benefits, redirect to the benefits list page
    navigate("/benefits");
  }, [navigate]);

  return null; // Or a loading indicator if needed
};

export default BenefitDetail;
