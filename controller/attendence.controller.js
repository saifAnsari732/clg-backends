
import { Attendance } from "../Models/attendence.js";

export const markAttendance = async (req, res) => {
  try {
    const { student, date, status } = req.body;
    const attendance = new Attendance({ student, date, status });
    await attendance.save();
    res.status(201).json({ attendance, message: "Attendance marked successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get attendance for a student
export const getAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ student: studentId });
    res.json(records);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};