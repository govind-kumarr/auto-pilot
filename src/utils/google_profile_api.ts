import axios from "axios";

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw new Error(error.message);
  }
}
