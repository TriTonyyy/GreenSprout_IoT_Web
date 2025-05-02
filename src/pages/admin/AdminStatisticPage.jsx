import React, { useState, useEffect, useCallback } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import {
  StatisticItem,
  StatisticItemSkeleton,
} from "../statisticsPage/statisticPageComponents/StatisticsItem";
import i18n from "../../i18n";
import { getAllDeviceApi, getListReport } from "../../api/adminApi";
import { apiResponseHandler } from "../../components/Alert/alertComponent";
import PagnipationComponent from "../../components/Pagnipation/PagnipationComponent";

const AdminStatisticPage = () => {
  const [allGardens, setAllGardens] = useState([]);
  const [allReports, setAllReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage]=useState(1);
  const [totalPage, setTotalPage]=useState(1);
    const limit = 9;
  
  const fetchAllGardens = useCallback(async () => {
    try {
      getAllDeviceApi(currentPage, limit)
        .then((res)=>{
            setTotalPage(res.totalPages)
            setAllGardens(res.data)
        })
        .catch((err)=>[
            apiResponseHandler(err.data.message)
        ])
      getListReport(currentPage, limit)
      .then((res)=>{
        setAllReports(res)
      }).catch((err)=>{
        apiResponseHandler(err.data.message)
      })
    } catch (err) {
      console.error("Failed to fetch gardens or reports:", err);
      setAllGardens([]);
      setAllReports({});
    }
  }, []);

  const handlePageChange = (page)=>{
    setCurrentPage(page);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllGardens();
      setLoading(false);
    };
    fetchData();
  }, [fetchAllGardens]);

  useEffect(()=>{
    getAllDeviceApi(currentPage, limit)
    .then((res)=>{
      setTotalPage(res.totalPages)
      setAllGardens(res.data)
    })
    .catch((err)=>{
      apiResponseHandler(err.data.message)
    })
  },[currentPage])

  return (
    <div>
      <HeaderComponent gardens={allGardens} />
      <div className="flex">
        <SideNavigationBar />
        <div className="w-full flex-grow min-h-screen">
          <div className="flex justify-between items-center px-10 py-10">
            <h1 className="text-4xl font-bold">
              <span className="text-green-500">
                Thống kê gần nhất của các khu vườn
              </span>
            </h1>
          </div>
            <h1 className="text-3xl px-10">
                <span className="text-green-500">
                  {/* {i18n.t("garden_of_account", { accountName: user?.name })} */}
                  {currentPage + " of " + totalPage }
                </span>
            </h1>
          <div className="flex flex-wrap gap-4 justify-start p-3">
            {loading ? (
              <>
                <StatisticItemSkeleton />
                <StatisticItemSkeleton />
                <StatisticItemSkeleton />
              </>
            ) : allGardens.length === 0 ? (
              <p>No gardens found.</p>
            ) : (
              allGardens.map((garden, index) => {
                const reportData = allReports[garden.id_esp];
                return (
                  <StatisticItem
                    key={garden.id_esp || index}
                    id={garden.id_esp}
                    name={garden.name_area}
                    img_area={garden.img_area}
                    report={reportData}
                  />
                );
              })
            )}
          </div>
          <PagnipationComponent
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default AdminStatisticPage;
