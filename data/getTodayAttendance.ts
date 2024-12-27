import { getAttendance } from "../server_actions/attendance";

interface Attendance {
  id: string;
  mealId: string;
  status: 'present' | 'absent';
  markedAt: Date;
}

export const getTodayAttendance = async (userId: string): Promise<Attendance[]> => {
  try {
    const attendance = await getAttendance(userId);
    return attendance.map(item => ({
      id: item.id,
      mealId: item.mealId,
      status: item.status as 'present' | 'absent',
      markedAt: item.markedAt
    }));
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};