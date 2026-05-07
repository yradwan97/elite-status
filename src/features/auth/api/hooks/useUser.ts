import { useQuery } from "@tanstack/react-query"
import { authApi } from "../authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";

export const useUser = () => {
    const dispatch = useDispatch()
    const { data, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: () => authApi.getUserProfile(),
    });

    if (data)
        dispatch(setUser(data))

    return {user: data, refetch}
}