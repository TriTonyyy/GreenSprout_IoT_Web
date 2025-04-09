import Swal from "sweetalert2";
import {
  addMemberByIdDevice,
  removeMemberByIdDevice,
  renameDeviceByIdDevice,
} from "../../api/deviceApi"; // Import the API function to update device members

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
          await addMemberByIdDevice(deviceId, {
            userId: member.userId,
            role: "member",
          });
          fetchUserDevices(); // ✅ Fix: Use the function from props
          Swal.fire("Thành công!", "Kết nối thành công!", "success");
        } catch (error) {
          // console.error("Error checking device:", error);
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

export const apiResponseHandler = (message,type) => {
  Swal.fire({
    icon: type || "success",
    text: message || "Something went wrong!",
  });
};

export const removeDevicePopup = (deviceId, userId) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn rời khỏi khu vườn này không?",
      text: "Khu vườn này sẽ không xuất hiện trong tài khoản bạn.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeMemberByIdDevice(deviceId, userId);
          await Swal.fire(
            "Rời thành công!",
            "Bạn đã rời khỏi khu vườn.",
            "success"
          );
          resolve(); // <-- notify success
        } catch (error) {
          apiResponseHandler("Failed to remove device. Please try again.");
          reject(error); // <-- notify failure
        }
      } else {
        reject("Cancelled");
      }
    });
  });
};

export const renameDevicePopup = (deviceId,name_area) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: "Vui lòng nhập tên mới cho khu vườn",
      input: "text",
      inputPlaceholder: "Vườn rau xanh",
      inputValue: name_area, // Set the initial value to the current name
      showCancelButton: true,
      confirmButtonText: "Đổi tên",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value) return "Hãy tên mới!";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value;
        // console.log(newName);
        // console.log(deviceId);
        try {
          await renameDeviceByIdDevice(deviceId, { name_area: newName });
          Swal.fire("Thành công!", "Thiết bị đã được đổi tên.", "success");
          resolve(); // ✅ Let caller know it's done
        } catch (error) {
          apiResponseHandler("Đổi tên thiết bị thất bại. Vui lòng thử lại.");
          reject(error);
        }
      } else {
        reject("cancelled");
      }
    });
  });
};

export const areUSurePopup = (message) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: message || "Bạn có chắc chắn không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        resolve();
      } else {
        reject("cancelled");
      }
    });
  });
}
