import { useState } from "react";

const fetchMessage = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data.message;
    } else {
      throw new Error(data.message || "Something went wrong");
    }
  } catch (error) {
    return error.message;
  }
};
