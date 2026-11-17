import { useNavigate, useSearchParams } from "react-router-dom";
import OfflineNotice from "../components/OfflineNotice";

function Offline() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get("from");
  // Only allow in-app paths
  const target = from && from.startsWith("/") && !from.startsWith("//") ? from : "/";

  return (
    <div className="offline-page">
      <OfflineNotice showLink={false} onRecovered={() => navigate(target, { replace: true })} />
    </div>
  );
}

export default Offline;
