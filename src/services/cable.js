import { createConsumer } from "@rails/actioncable";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const cable = createConsumer(`${API_URL}/cable`);