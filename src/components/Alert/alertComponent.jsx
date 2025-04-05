import Swal from "sweetalert2";
import { getGardenByDevice, addMemberByIdDevice } from "../../api/deviceApi"; // Import the API function to update device members

// SweetAlert2 popup function to add a device
export const addDevicePopup = (member, fetchUserDevices) => {
  // 👈 Accept function as a parameter
  const retryFunction = async () => {
    Swal.fire({
      title: "Vui lòng nhập mã thiết bị",
      input: "text",
      inputPlaceholder: "ID: 43528132",
      showCancelButton: true,
      confirmButtonText: "Kết nối",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value) return "Hãy nhập mã thiết bị!";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deviceId = result.value;
        // console.log(deviceId);
        // console.log(member.userId);
        try {
          await addMemberByIdDevice(deviceId, {userId: member.userId, role: "member",});
          fetchUserDevices(); // ✅ Fix: Use the function from props
          Swal.fire("Thành công!", "Kết nối thành công!", "success");
        } catch (error) {
          console.error("Error checking device:", error);
          Swal.fire({
            title: "Thất bại",
            text: "Thiết bị không tồn tại",
            icon: "error",
            confirmButtonText: "Thử lại",
          }).then((result) => {
            if (result.isConfirmed) retryFunction();
          });
        }
      }
    });
  };
  retryFunction();
};

export const apiResponseHandler = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message || "Something went wrong!",
  });
};
