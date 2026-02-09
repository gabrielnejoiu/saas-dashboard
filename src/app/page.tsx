import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the projects dashboard
  redirect("/projects");
}
