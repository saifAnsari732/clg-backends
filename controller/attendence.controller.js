
import { Attendance } from "../Models/attendence.js";

export const markAttendance = async (req, res) => {
  try {
    const { student, date, status } = req.body;
   
  //  date localdate split the other part
    if (!student || !date || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }
     const localdate=date.split("T")[0];

    const attendance = new Attendance({ student, date:localdate, status });
    await attendance.save();
    res.status(201).json({ attendance, message: "Attendance marked successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get attendance for a student
export const getattendence = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ student: studentId });
    res.json({records, message: "Attendance records fetched successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



