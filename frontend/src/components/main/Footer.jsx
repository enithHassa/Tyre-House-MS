export default function Footer() {
  return (
    <footer className="bg-[#232323] text-gray-200 pt-10 pb-2 w-full mt-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-0 pb-8 border-b border-gray-700">
        {/* Business Hours */}
        <div className="mb-8 md:mb-0">
          <div className="text-lg font-bold text-orange-400 mb-2 border-b-2 border-orange-400 w-fit pb-1">Business Hours</div>
          <div className="text-gray-300">Monday - Friday: 8:00 AM - 6:00 PM</div>
          <div className="text-gray-300">Saturday: 9:00 AM - 5:00 PM</div>
          <div className="text-gray-300">Sunday: <span className="text-gray-400">Closed</span></div>
        </div>
        {/* Location */}
        <div>
          <div className="text-lg font-bold text-orange-400 mb-2 border-b-2 border-orange-400 w-fit pb-1">Location</div>
          <div className="text-gray-300">No-177, Galle Rd, Beruwala, Colombo, Sri Lanka</div>
          <div className="text-gray-300">Phone: 0342278240</div>
          <div className="text-gray-300">Email: Sithuruwana.tyremart@gmail.com</div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm pt-4 pb-2 border-t border-gray-800">
        &copy; {new Date().getFullYear()} Tyre Shop (Pvt) Ltd. All rights reserved.
      </div>
    </footer>
  );
} 