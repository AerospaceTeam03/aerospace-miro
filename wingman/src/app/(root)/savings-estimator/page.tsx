import { getAllExposures } from "@/components/features/savings-estimator/compute";
import SavingsEstimatorView from "@/components/features/savings-estimator/SavingsEstimatorView";

export default function SavingsEstimatorPage() {
  const exposures = getAllExposures();
  return <SavingsEstimatorView exposures={exposures} />;
}
