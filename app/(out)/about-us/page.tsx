import Footer from "@/components/Footer/Footer";
import HeaderNav from "@/components/Header/HeaderNav/HeaderNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AboutPage = () => {
  return (
    <div>
      {/* Toast Notifications Container */}
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <HeaderNav position="relative" />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">About Us</h3>
            <p className="text-lg md:text-xl text-gray-600">
              GSG Learn Gate is a learning management platform built by Gaza
              Sky Geeks to connect students, mentors, and co-mentors around
              structured, cohort-based courses.
            </p>
          </div>

          <div className="mt-10 max-w-3xl mx-auto space-y-6 text-gray-700">
            <div>
              <h4 className="text-xl font-semibold mb-2">Our Mission</h4>
              <p>
                We equip learners with practical, job-ready skills through
                mentor-led courses, hands-on tasks, and continuous feedback,
                giving every student a clear path from enrollment to
                completion.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2">What We Offer</h4>
              <p>
                Course tracks led by dedicated monitors and co-monitors,
                assignment submission and grading, progress tracking,
                scheduled sessions, and direct communication between
                students and their mentors.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2">Get in Touch</h4>
              <p>
                Have a question about a course or your account? Reach out
                through our{" "}
                <a href="/contact-us" className="underline hover:no-underline">
                  Contact Us
                </a>{" "}
                page and our team will get back to you.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
