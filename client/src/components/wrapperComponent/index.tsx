import { observer } from "mobx-react-lite";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Context } from "../../App";
import AlertsComponent from "../alertsComponent";
import LoadingSpinner from "../loadingSpinner";
import RegistrationModal from "../registrationModal";

const WrapperComponent = observer(({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const store = useContext(Context);
  useEffect(() => {
    if (!store.state.userId) {
      if (!localStorage.getItem("userId")) {
        setIsModalOpen(true);
      } else {
        store.setUserId(localStorage.getItem("userId")!);
      }
    }
  }, [store.state.userId, setIsModalOpen, store.setUserId, isModalOpen, store]);
  return (
    <div>
      {children}
      <div
        style={{
          position: "fixed",
          zIndex: 5000,
        }}
      >
        {store.state.isBeingSubmitted && <LoadingSpinner />}
        {isModalOpen && (
          <RegistrationModal
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
          />
        )}

        <AlertsComponent />
      </div>
    </div>
  );
});

export default WrapperComponent;
