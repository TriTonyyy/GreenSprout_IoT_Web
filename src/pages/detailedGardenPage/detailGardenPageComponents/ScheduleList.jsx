import React from "react";
import ScheduleCard from "./ScheduleCard";
import ScheduleEditor from "./ScheduleEditor";
import ScheduleSkeleton from "./ScheduleSkeleton";
import { apiResponseHandler } from "../../../components/Alert/alertComponent";

const ScheduleList = ({
  schedules,
  loading,
  selectedSchedule,
  onScheduleSelect,
  onScheduleDelete,
  onScheduleChange,
  onScheduleSave,
  onScheduleCancel,
  onScheduleToggleStatus,
  selectedControl,
  onAddSchedule,
  isOwner,
}) => {
  if (loading) {
    return <ScheduleSkeleton />;
  }

  const handleAddSchedule = () => {
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể thêm lịch tưới", "error");
      return;
    }
    onAddSchedule(selectedControl);
  };

  const handleScheduleSelect = (scheduleId) => {
    onScheduleSelect(scheduleId);
  };

  const handleScheduleDelete = (scheduleId) => {
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể xóa lịch tưới", "error");
      return;
    }
    onScheduleDelete(scheduleId);
  };

  const handleScheduleChange = (scheduleId, field, value) => {
    if (!isOwner) {
      apiResponseHandler("Chỉ chủ sở hữu mới có thể thay đổi lịch tưới", "error");
      return;
    }
    console.log("Changing schedule:", { scheduleId, field, value });
    onScheduleChange(scheduleId, field, value);
  };

  return (
    <div className="flex flex-wrap gap-5">
      {schedules.map((schedule) => (
        <div key={schedule._id}>
          <ScheduleCard
            schedule={schedule}
            isSelected={selectedSchedule === schedule._id}
            onSelect={handleScheduleSelect}
            onDelete={handleScheduleDelete}
            onToggleStatus={onScheduleToggleStatus}
            isOwner={isOwner}
          >
            {selectedSchedule === schedule._id && (
              <ScheduleEditor
                schedule={schedule}
                onChange={handleScheduleChange}
                onSave={onScheduleSave}
                onCancel={onScheduleCancel}
                isOwner={isOwner}
              />
            )}
          </ScheduleCard>
        </div>
      ))}
      {isOwner && schedules.length < 5 && (
        <div
          onClick={handleAddSchedule}
          className="w-[310px] h-[196px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200"
        >
          <div className="text-3xl text-gray-400 mb-1">+</div>
          <div className="text-gray-600 font-medium">Thêm lịch tưới</div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
