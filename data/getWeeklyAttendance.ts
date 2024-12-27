import { getWeekAttendance } from "../server_actions/attendance";  

export interface AttendanceData {
  day: string;
  present: number;
  absent: number;
}

export async function getFormattedWeeklyAttendance(): Promise<AttendanceData[]> {
    try {
      const rawAttendanceData = (await getWeekAttendance()).map((data: { id: string; userId: string; mealId: string; status: string; markedAt: Date; }) => ({
        day: data.markedAt.toLocaleDateString('en-US', { weekday: 'long' }),
        presentCount: data.status === 'present' ? 1 : 0,
        absentCount: data.status === 'absent' ? 1 : 0,
      }));
      const attendanceMap: { [key: string]: { present: number; absent: number } } = {};
  
      rawAttendanceData.forEach((dayData: { day: string; presentCount: number; absentCount: number }) => {
        const day = dayData.day; // Assuming dayData.day is a string representing the day
        if (!attendanceMap[day]) {
          attendanceMap[day] = { present: 0, absent: 0 };
        }
        attendanceMap[day].present += dayData.presentCount; // Assuming dayData.presentCount is the count of present students
        attendanceMap[day].absent += dayData.absentCount; // Assuming dayData.absentCount is the count of absent students
      });
  
      const formattedData: AttendanceData[] = Object.keys(attendanceMap).map(day => ({
        day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent,
      }));
  
      return formattedData;
    } catch (error) {
        console.log(error);
        return [];
    }
  }

  export interface TotalAttendanceData {
    totalPresent: number;
    totalAbsent: number;
  }
  
  export async function getFormattedTotalWeeklyAttendance(): Promise<TotalAttendanceData> {
    try {
      const rawAttendanceData = (await getWeekAttendance()).map((data: { id: string; userId: string; mealId: string; status: string; markedAt: Date; }) => ({
        day: data.markedAt.toLocaleDateString('en-US', { weekday: 'long' }),
        presentCount: data.status === 'present' ? 1 : 0,
        absentCount: data.status === 'absent' ? 1 : 0,
      }));

      let totalPresent = 0;
      let totalAbsent = 0;
  
      rawAttendanceData.forEach((dayData: { day: string; presentCount: number; absentCount: number }) => {
        totalPresent += dayData.presentCount;
        totalAbsent += dayData.absentCount;
      })

      return {
        totalPresent,
        totalAbsent,
      };
    }catch(error){
        console.error("Error fetching weekly attendance data:", error);
        throw error;
    }

}