import { BACKEND_HOST } from "@/module/config/config";
import { redirect } from "@/navigation";

export default function LoginPage() {
  const url = new URL("https://portal.ncu.edu.tw/oauth2/authorization");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("state", "0");
  // 正式環境
  url.searchParams.append("client_id", "20250101165455gNN4VJXGPlJb");

  // 測試環境
  // url.searchParams.append("client_id", "20250207230835lHQAg8jjiqz1");
  url.searchParams.append("redirect_uri", `${BACKEND_HOST}/api/auth/return-to`);
  url.searchParams.append("scope", "identifier chinese-name");

  return redirect(url.href);
}
