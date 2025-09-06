import axios from "axios";
import qs from "qs";

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = process.env.GOOGLE_REDIRECT_URL;

export async function getGoogleOAuthTokens({ code }: { code: string }) {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  };
  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
export function getGoogleOAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;

  const options: any = {
    redirect_uri,
    client_id,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}

export async function getNewAccessToken(refresh_token: string) {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    client_id,
    client_secret,
    refresh_token,
    grant_type: "refresh_token",
  };

  console.log("Refreshing access token with:", values);

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Google error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw new Error("Failed to refresh access token");
  }
}
