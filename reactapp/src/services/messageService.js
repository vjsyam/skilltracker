import { apiGet } from "./api";

export const getMessages = async (page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") => {
  try {
    const res = await apiGet("/messages", { page, size, sortBy, sortDir });
    return res.content || res.data || res || [];
  } catch (error) {
    console.error('messageService.getMessages error:', error);
    return [];
  }
};

// Send message without authentication (public endpoint)
export const sendMessage = async (message) => {
  try {
    const response = await fetch("http://localhost:8080/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};