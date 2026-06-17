import axios from "axios";

export const sendMessage = async (
    message: string
) => {

    const response = await axios.post(
        "http://localhost/Backend/Api/chat.php",
        {
            message
        }
    );

    return response.data;
};