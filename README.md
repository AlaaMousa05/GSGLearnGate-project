# 🚀 GSGLearnGate – Learning Management System for Gaza Sky Geeks

**GSGLearnGate** is a full-stack hybrid classroom platform built with **Next.js** to empower learning at **Gaza Sky Geeks (GSG)**. It combines essential educational tools into a single system to enhance communication, collaboration, and academic progress tracking.


![image](https://github.com/user-attachments/assets/be998a8a-3a80-4d57-acd8-6595f2cb0441)


---

## 🧠 Overview

GSGLearnGate supports multiple user roles with defined permissions, streamlining the entire learning lifecycle from course creation to certification. The system facilitates:

- Course Management  
- Student Engagement  
- Task Assignments & Grading  
- Attendance Tracking  

---

## 🎯 Key Features

### 🔐 User Roles & Permissions

| Role          | Capabilities                                                                 |
|---------------|------------------------------------------------------------------------------|
| **Admin**     | Manage courses, users, and sending course announcement                      |
| **Monitor**   | Add tasks, announcements, grade students, track attendance                  |
| **Co-Monitor**| Assist in grading, manage attendance alerts and student interviews          |
| **Student**   | Submit tasks, request appointments, post comments, receive grades           |

---

## 🔄 System Workflow

1. **📢 Course Announcement & Registration**  
   Admins post courses → Students apply 

2. **📝 Application & Interview**  
   Admins/monitors review applications → Accepted students schedule interviews

3. **📚 Course Enrollment & Activities**  
   Monitors post announcements/tasks → Students submit and discuss assignments

4. **📊 Attendance**  
   Track students attendance

---

## 🧭 Pages & Functionalities

- **Admin Dashboard**: Manage users/courses, send announcements
- **Monitor Dashboard**: Grade assignments, post tasks, record attendance
- **Student Dashboard**: View courses, submit work, check grades

---

## ⚙️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, NextUI
- **Database**: SQLite (via Drizzle ORM)
- **Email**: EmailJS 
- **Icons**: Phosphor Icons
- **Charts**: Recharts
- **Animations**: Framer Motion

---

## 🛠️ Setup & Installation
```git clone https://github.com/AbdallahShnaino/GSGLearnGate.git ```

``` npm install ``` 

---

## 🔑 Demo Accounts

Use these seeded accounts (via `npm run db:seed`) to try out each role:

| Role | Name | Email | Password |
|------|------|-------|----------|
| Admin | Rana Haddad | demo.admin@example.com | `DemoAdmin2026` |
| Monitor | Omar Jaber | demo.mentor@example.com | `DemoMentor2026` |
| Co-Monitor | Lina Abu Zayd | demo.commentor@example.com | `DemoCommentor2026` |
| Student | Yousef Nasser | demo.student@example.com | `DemoStudent2026` |

## 🤝 Acknowledgments
GSGLearnGate is developed for Gaza Sky Geeks to support a future of seamless, collaborative, and empowering education.
