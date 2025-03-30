import { CircularProgress } from "@mui/material";

export default function Loader() {
    return (
        <div className="flex items-center justify-center text-center h-screen bg-gradient-to-b from-blue-100 to-indigo-200 ">
        <CircularProgress />
        </div>
    )
}