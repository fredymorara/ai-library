// src/components/Footer.jsx
export const Footer = () => {
  return (
    // UPDATED: Background is now transparent
    <footer id="contact" className="bg-transparent">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-5xl font-bold text-white">Get in Touch</h2>
          <p className="mt-4 text-xl text-gray-400">
            Have questions about the project or want to collaborate? Feel free to reach out.
          </p>
          <a href="mailto:your.email@example.com" className="mt-6 inline-block text-lg text-indigo-400 hover:text-indigo-300">
            momanyifredm@gmail.com
          </a>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              &copy; 2024. Smart Library Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};