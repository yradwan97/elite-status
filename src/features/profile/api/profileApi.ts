import api from "@/lib/axios";
import { uploadApi } from "@/features/auth/api/uploadApi";

export type ProfileUpdateData = {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    gender?: "male" | "female" | null;
    nationality?: string | null;
    IDFront?: File | string | null;
    IDBack?: File | string | null;
    image?: File | string | null;
};

export type ChangePasswordData = {
    currentPassword: string;
    newPassword: string;
};

export const profileApi = {
    updateProfile: async (data: ProfileUpdateData) => {
        let IDFrontUrl: string | undefined;
        let IDBackUrl: string | undefined;
        let imageUrl: string | undefined;

        try {
            const uploadPromises: Promise<string>[] = [];

            // Handle IDFront
            if (data.IDFront instanceof File) {
                uploadPromises.push(uploadApi(data.IDFront));
            } else if (typeof data.IDFront === "string" && data.IDFront.trim() !== "") {
                IDFrontUrl = data.IDFront;
            }

            // Handle IDBack
            if (data.IDBack instanceof File) {
                uploadPromises.push(uploadApi(data.IDBack));
            } else if (typeof data.IDBack === "string" && data.IDBack.trim() !== "") {
                IDBackUrl = data.IDBack;
            }

            // Handle Profile Image
            if (data.image instanceof File) {
                uploadPromises.push(uploadApi(data.image));
            } else if (typeof data.image === "string" && data.image.trim() !== "") {
                imageUrl = data.image;
            }

            // Upload all new files in parallel (if any)
            if (uploadPromises.length > 0) {
                const uploadedUrls = await Promise.all(uploadPromises);
                let index = 0;

                if (data.IDFront instanceof File) {
                    IDFrontUrl = uploadedUrls[index++];
                }
                if (data.IDBack instanceof File) {
                    IDBackUrl = uploadedUrls[index++];
                }
                if (data.image instanceof File) {
                    imageUrl = uploadedUrls[index++];
                }
            }

        } catch (uploadError) {
            console.error("Error uploading profile images:", uploadError);
            throw new Error("Failed to upload profile images. Please try again.");
        }

        // Prepare final payload as JSON
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            gender: data.gender || undefined,
            nationality: data.nationality || undefined,
            IDFront: IDFrontUrl,
            IDBack: IDBackUrl,
            image: imageUrl,
        };

        const response = await api.put("/users", payload);

        return response.data;
    },

    changePassword: async (data: ChangePasswordData) => {
        const response = await api.post("/auth/change-password", {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
 
        return response.data;
    },

    deleteUserAccount: async () => {
        const response = await api.delete('/users')
        return response.data;
    }
};