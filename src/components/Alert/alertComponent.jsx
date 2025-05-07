import Swal from "sweetalert2";
import {
  addMemberByIdDevice,
  removeMemberByIdDevice,
  renameDeviceByIdDevice,
} from "../../api/deviceApi"; // Import the API function to update device members

// SweetAlert2 popup function to add a device
export const addDevicePopup = (member, fetchUserDevices) => {
  const retryFunction = async () => {
    Swal.fire({
      title: "Vui lòng nhập mã thiết bị",
      input: "text",
      inputPlaceholder: "ID: 43528132",
      showCancelButton: true,
      confirmButtonText: "Kết nối",
      cancelButtonText: "Hủy",
      scrollbarPadding: false,
      inputValidator: (value) => {
        if (!value) return "Hãy nhập mã thiết bị!";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deviceId = result.value;
        try {
          // Proceed to add if not blocked
          await addMemberByIdDevice(deviceId, {
            userId: member.userId,
            role: "member",
          });
          fetchUserDevices();
          apiResponseHandler("Kết nối khu vườn thành công!", "success");
        } catch (error) {
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

export const apiResponseHandler = (message, type) => {
  Swal.fire({
    icon: type || "success",
    text: message || "Something went wrong!",
    timer: 1000, // auto close after 2 seconds
    showConfirmButton: false, // hide the OK button
    timerProgressBar: true, // optional: shows a progress bar
    scrollbarPadding: false,
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
      scrollbarPadding: false,
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

export const renameDevicePopup = (deviceId, name_area) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: "Vui lòng nhập tên mới cho khu vườn",
      input: "text",
      inputPlaceholder: "Vườn rau xanh",
      inputValue: name_area, // Set the initial value to the current name
      showCancelButton: true,
      confirmButtonText: "Đổi tên",
      cancelButtonText: "Hủy",
      scrollbarPadding: false,
      inputValidator: (value) => {
        if (!value) return "Hãy tên mới!";
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value;
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

export const areUSurePopup = (message, type = "warning") => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: message || "Bạn có chắc chắn không?",
      icon: type, // Icon changes based on the type (warning, question, etc.)
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      confirmButtonColor: "#22c55e", // Green color
      cancelButtonColor: "#ef4444", // Red color
      buttonsStyling: true,
      scrollbarPadding: false,
      customClass: {
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true); // Resolves with true if confirmed
      } else {
        resolve(false); // Resolves with false if canceled
      }
    });
  });
};

export const changePasswordPopUp = (message) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: message || "Change Password",
      html:
        '<input id="swal-input3" class="swal2-input" type="password" placeholder="Old Password">' +
        '<input id="swal-input1" class="swal2-input" type="password" placeholder="New Password">' +
        '<input id="swal-input2" class="swal2-input" type="password" placeholder="Confirm Password">',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      scrollbarPadding: false,
      preConfirm: () => {
        const oldPassword = document.getElementById("swal-input3").value;
        const password = document.getElementById("swal-input1").value;
        const confirmPassword = document.getElementById("swal-input2").value;

        // Basic validation
        if (!oldPassword) {
          Swal.showValidationMessage("Old password is required!");
          return false;
        }
        if (!password || !confirmPassword) {
          Swal.showValidationMessage("Both fields are required!");
          return false;
        }
        if (password !== confirmPassword) {
          Swal.showValidationMessage("Passwords do not match!");
          return false;
        }

        return { oldPassword, password, confirmPassword };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(result.value); // Pass the values to the caller
      }
    });
  });
};

export const selectNewOwnerPopup = (members) => {
  return new Promise((resolve, reject) => {
    const nonOwnerMembers = members.filter((member) => member.role !== "owner");
    const options = nonOwnerMembers.map((member) => ({
      text: member.name,
      value: member.userId,
    }));

    Swal.fire({
      title: "Chọn thành viên làm chủ vườn mới",
      text: "Bạn cần chọn một thành viên làm chủ vườn mới trước khi rời đi",
      input: "select",
      inputOptions: Object.fromEntries(
        options.map((opt) => [opt.value, opt.text])
      ),
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#22c55e", // Green color
      cancelButtonColor: "#ef4444",
      scrollbarPadding: false,
      inputValidator: (value) => {
        if (!value) {
          return "Bạn cần chọn một thành viên!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedMember = nonOwnerMembers.find(
          (m) => m.userId === result.value
        );
        resolve(selectedMember);
      } else {
        reject("cancelled");
      }
    });
  });
};
