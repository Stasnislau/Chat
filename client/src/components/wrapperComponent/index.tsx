import { observer } from "mobx-react-lite";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Context } from "../../App";
import AlertsComponent from "../alertsComponent";
import LoadingSpinner from "../loadingSpinner";
import RegistrationModal from "../registrationModal";
import { API_URL } from "../../constants";

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
  useEffect(() => {
    if (store.state.userId) {
      const fetchUser = async () => {
        try {
          store.setIsLoading(true);
          const response = await fetch(
            `${API_URL}/user/getById/${store.state.userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (response.status < 200 || response.status >= 300) {
            throw new Error(data.message);
          }
          store.setUserName(data.name);
        } catch (error: any) {
          console.log(error.message);
        } finally {
          store.setIsLoading(false);
        }
      };
      if (store.state.userId) {
        fetchUser();
      }
    }
  }, [store.state.userId]);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
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
