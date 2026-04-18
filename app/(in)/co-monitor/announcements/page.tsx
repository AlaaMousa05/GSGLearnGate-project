import { getCoMonitorCoursesNames } from "@/services/courses";
import AnnouncementsTableByCoMonitor from "@/components/AnnouncementsTable/AnnouncementsTableByCoMonitor";
import { requireAuth } from "@/context/auth";
import { Newspaper } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function Page() {
  const user = await requireAuth();
  const coursesList = await getCoMonitorCoursesNames(user.userId);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Announcements</h1>
        <Link href="/co-monitor/announcements/create">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FFA41F] text-white rounded-md hover:bg-[#F59000]">
            <Newspaper size={18} />
            <span>Post Announcement</span>
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <AnnouncementsTableByCoMonitor coMonitorCoursesList={coursesList} />
      </div>
    </div>
  );
}
