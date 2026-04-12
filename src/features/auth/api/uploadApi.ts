import axios from "@/lib/axios";

export async function uploadApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post("/uploads/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data.fileName; // adjust key if the response shape differs
}