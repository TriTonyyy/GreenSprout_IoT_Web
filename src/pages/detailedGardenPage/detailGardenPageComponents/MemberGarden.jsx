import React from "react";
import { Trash, User } from "lucide-react";
import {
  apiResponseHandler,
  areUSurePopup,
} from "../../../components/Alert/alertComponent";
import {
  addBlockMember,
  removeBlockMember,
  removeMemberByIdDevice,
} from "../../../api/deviceApi";
import i18n from "../../../i18n";


function MemberGarden({ members, blocks, isOwner, onRemoveMember, deviceId }) {
  const activeMembers = members;
  const bannedMembers = blocks;
  console.log(blocks);

  const onRemoveBanned = async (member) => {
    console.log(member.userId);
    try {
      // First confirmation popup
      const confirmRemove = await areUSurePopup(
        `Bạn có chắc chắn muốn xóa <strong style="color: #dc2626;">${member.name}</strong> khỏi danh sách chặn?`,
        "warning"
      );
      if (confirmRemove) {
        await removeBlockMember(deviceId, member.userId); // <-- store response here
        apiResponseHandler(
          `Đã xóa "${member.name}" khỏi danh sách chặn`,
          `success`
        );
      }
    } catch (error) {
      if (error === "cancelled") return;
      console.error("Error during removing blocked member:", error);
      apiResponseHandler("Không thể xóa thành viên", "error");
    }
  };

  return (
    <div className="flex flex-col py-4 w-full h-full justify-between ">
      <div className="flex gap-2">
        {/* Show both columns if owner */}
        {isOwner ? (
          <>
            {/* Active Members Column */}
            <div className="flex-1">
              {activeMembers.length > 0 && (
                <div className="h-[400px] overflow-y-auto">
                  {" "}
                  {/* Set height and make it scrollable */}
                  <h3 className="border-green-400 text-green-500 text-center uppercase font-bold">
                    {i18n.t("a_member")}
                  </h3>
                  <MemberList
                    members={activeMembers}
                    onEdit={onRemoveMember}
                    isOwner={isOwner}
                  />
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="border-l-2 border-gray-300 mx-4" />

            {/* Banned Members Column */}
            <div className="flex-1">
              {bannedMembers && (
                <div className="h-[400px] overflow-y-auto">
                  {" "}
                  {/* Set height and make it scrollable */}
                  <h3 className="border-rose-400 text-rose-500 uppercase text-center font-bold">
                    {i18n.t("b_member")}
                  </h3>
                  <BannedMemberList
                    members={bannedMembers}
                    onEdit={onRemoveBanned}
                    isOwner={isOwner}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          // Show only active members if not owner
          <div className="w-full">
            {activeMembers.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Active Members
                </h3>
                <MemberList
                  members={activeMembers}
                  onEdit={onRemoveMember}
                  isOwner={isOwner}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const MemberList = ({ members, onEdit, isOwner }) => {
  const sortedMembers = [...members].sort((a, b) => {
    if (a.isMe) return -1;
    if (b.isMe) return 1;
    return 0;
  });

  return (
    <div className="h-full overflow-y-auto flex flex-col space-y-4">
      {sortedMembers.map((member, index) => (
        <div
          key={member.email || member.name || index}
          className="border rounded-md px-4 py-3 flex justify-between items-center bg-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg text-sky-500">
              {member.img ? (
                <img
                  src={member.img}
                  alt="User"
                  className="w-8 h-8 inline-block rounded-full"
                />
              ) : (
                <User size={24} className="text-sky-500" />
              )}
            </span>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center">
                <span className="font-medium text-gray-800">
                  {member.isMe ? "You" : member.name ?? "Unknown"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {member.role ?? "No role"}
              </span>
            </div>
          </div>
          {isOwner && member.role !== "owner" && (
            <button
              onClick={() => onEdit(member)}
              className="text-rose-600 hover:text-rose-800 transition p-2 rounded-md hover:bg-rose-100"
            >
              <Trash size={18} className="text-red-600" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const BannedMemberList = ({ members, onEdit, isOwner }) => {
  return (
    <div className="flex flex-col space-y-4">
      {members.map((member, index) => (
        <div
          key={member.email || member.name || index}
          className="border rounded-md px-4 py-3 my-3 flex justify-between items-center bg-red-50 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg text-red-500">
              {member.img ? (
                <img
                  src={member.img}
                  alt="User"
                  className="w-8 h-8 inline-block rounded-full"
                />
              ) : (
                <User size={24} className="text-red-500" />
              )}
            </span>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center">
                <span className="font-medium text-gray-800">
                  {member.isMe ? "You" : member.name ?? "Unknown"}
                </span>
              </div>
              <span className="text-sm text-gray-500">{i18n.t("banned")}</span>
            </div>
          </div>
          {isOwner && member.role !== "owner" && (
            <button
              onClick={() => onEdit(member)}
              className="text-rose-600 hover:text-rose-800 transition p-2 rounded-md hover:bg-rose-100"
            >
              <Trash size={18} className="text-red-600" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export {MemberGarden, MemberList};
