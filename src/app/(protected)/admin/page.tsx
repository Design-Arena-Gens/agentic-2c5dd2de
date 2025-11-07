import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { announcements } from "@/data/sample-data";
import { authOptions } from "@/lib/auth-options";
import {
  getAggregateTrendline,
  getFeedbackSnapshot,
  getInventoryRisk,
  getWasteForecast,
} from "@/lib/analytics";
import { getUpcomingMenus } from "@/lib/menu";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/employee");
  }

  const trendline = getAggregateTrendline();
  const wasteForecast = getWasteForecast();
  const menus = getUpcomingMenus(5);
  const inventory = getInventoryRisk();
  const feedbackSnapshot = getFeedbackSnapshot();

  const adminAnnouncements = announcements.filter(
    (announcement) => announcement.audience === "admin" || announcement.audience === "all",
  );

  return (
    <AdminDashboard
      user={session.user}
      trendline={trendline}
      wasteForecast={wasteForecast}
      menus={menus}
      inventory={inventory}
      feedbackSnapshot={feedbackSnapshot}
      announcements={adminAnnouncements}
    />
  );
}
