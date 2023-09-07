import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from "../../App";
import AlertsComponent from "../alertsComponent";
import LoadingSpinner from "../loadingSpinner";
import { API_URL } from "../../constants";

const WrapperComponent = observer(() => {
  const store = useContext(Context);
  // handling creating of a user
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 5000,
      }}
    >
      {store.state.isBeingSubmitted && <LoadingSpinner />}
      <AlertsComponent />
    </div>
  );
});

export default WrapperComponent;