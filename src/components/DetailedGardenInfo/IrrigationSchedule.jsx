import React from "react";

const ScheduleCard = ({ time, duration, days, isActive, onToggle }) => (
  <div
    style={{
      borderRadius: "10px",
      backgroundColor: "#f5f5f5",
      padding: "10px",
      margin: "10px 0",
    }}
  >
    <h3>{time}</h3>
    <p>Thời gian tưới: {duration}</p>
    <p>Lặp lại: {days}</p>
    <ToggleSwitch label="Active" isOn={isActive} onToggle={onToggle} />
  </div>
);

const IrrigationSchedule = () => {
  const [schedules, setSchedules] = React.useState([
    {
      time: "9:00 AM",
      duration: "30 phút",
      days: "T2, T4, T6",
      isActive: true,
    },
  ]);

  const addSchedule = () => {
    // Logic to open a modal/form and add a new schedule
  };

  return (
    <div>
      <h2>Lịch trình tưới</h2>
      {schedules.map((schedule, index) => (
        <ScheduleCard
          key={index}
          {...schedule}
          onToggle={() => {
            const newSchedules = [...schedules];
            newSchedules[index].isActive = !newSchedules[index].isActive;
            setSchedules(newSchedules);
          }}
        />
      ))}
      <button
        onClick={addSchedule}
        style={{ borderRadius: "50%", width: "30px", height: "30px" }}
      >
        +
      </button>
    </div>
  );
};
