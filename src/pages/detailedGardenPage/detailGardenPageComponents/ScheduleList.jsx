import React from "react";
import ScheduleCard from "./ScheduleCard";
import ScheduleEditor from "./ScheduleEditor";
import ScheduleSkeleton from "./ScheduleSkeleton";

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
}) => {
  if (loading) {
    return <ScheduleSkeleton />;
  }

  const handleAddSchedule = () => {

    onAddSchedule(selectedControl);
  };

  const handleScheduleSelect = (scheduleId) => {
    onScheduleSelect(scheduleId);
  };

  const handleScheduleDelete = (scheduleId) => {
 
    onScheduleDelete(scheduleId);
  };

  const handleScheduleChange = (scheduleId, field, value) => {
    console.log("Changing schedule:", { scheduleId, field, value });
    onScheduleChange(scheduleId, field, value);
  };

  return (
    <div className="flex flex-wrap gap-5">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule._id}
          schedule={schedule}
          isSelected={selectedSchedule === schedule._id}
          onSelect={handleScheduleSelect}
          onDelete={handleScheduleDelete}
          onToggleStatus={onScheduleToggleStatus}
        >
          {selectedSchedule === schedule._id && (
            <ScheduleEditor
              schedule={schedule}
              onChange={handleScheduleChange}
              onSave={onScheduleSave}
              onCancel={onScheduleCancel}
            />
          )}
        </ScheduleCard>
      ))}
      {schedules.length < 12 && (
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
