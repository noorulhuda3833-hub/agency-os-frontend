import { createConsumer } from "@rails/actioncable";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://agency-os-api-ma7u.onrender.com";

export const cable = createConsumer(`${API_URL}/cable`);