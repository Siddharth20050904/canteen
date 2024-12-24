export const Footer = () => {
    return (
      <footer className="border-t bg-white py-4 px-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">© 2024 Mess Management System</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    );
  };