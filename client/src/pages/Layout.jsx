import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import InvoiceModal from "../components/InvoiceModal";
import Sidebar from "../components/Sidebar";
import { InvoiceContext } from "../context/InvoiceProvider";
import { ProfileContext } from "../context/ProfileProvider";
import Api from "../api";

export default function Layout() {
  const { setProfilePicture, setProfileData } = useContext(ProfileContext);
  const { setAllData, setFilteredInvoices, setLoading } =
    useContext(InvoiceContext);
  const navigate = useNavigate();

  useEffect(() => {
    function fetchData() {
      try {
        fetchInvoices();
        fetchProfile();
      } catch (error) {
        if(error.response?.data?.message === "Access token not found!") {
          return navigate("/login")
        }
      }
    }

    fetchData();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      Api.getProfile().then((res) => {
        if (res.data) {
          setProfileData(res.data?.userProfile);
          setProfilePicture(res.data?.userProfile?.profilePicture);
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  }

  async function fetchInvoices() {
    try {
      setLoading(true);
      Api.getInvoices().then((res) => {
        setAllData(res);
        setFilteredInvoices(res);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg dark:bg-bg-dark flex">
      <Sidebar />
      <InvoiceModal />
      <Outlet />
    </div>
  );
}
