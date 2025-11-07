import { EmployeeDashboard } from "@/components/employee/employee-dashboard";
import { announcements } from "@/data/sample-data";
import { authOptions } from "@/lib/auth-options";
import {
  getAggregateTrendline,
  getEmployeeHistory,
  getEmployeeOptInOverview,
  getWasteForecast,
} from "@/lib/analytics";
import { getNextMenu, getUpcomingMenus } from "@/lib/menu";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function EmployeePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "employee") {
    redirect("/admin");
  }

  const upcomingMenus = getUpcomingMenus(5);
  const nextMenu = getNextMenu();
  const optInSummary = getEmployeeOptInOverview(session.user.id);
  const trendline = getAggregateTrendline();
  const history = getEmployeeHistory(session.user.id);
  const wasteForecast = getWasteForecast();

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.audience === "all" || announcement.audience === "employee",
  );

  return (
    <EmployeeDashboard
      user={session.user}
      userId={session.user.id}
      upcomingMenus={upcomingMenus}
      nextMenu={nextMenu}
      optInSummary={optInSummary}
      trendline={trendline}
      history={history}
      announcements={filteredAnnouncements}
      wasteForecast={wasteForecast}
    />
  );
}
