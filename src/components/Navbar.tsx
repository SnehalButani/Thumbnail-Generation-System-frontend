interface NavbarProps {
  title: string;
}

const Navbar = ({ title }: NavbarProps) => (
  <nav className="flex items-center h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
    <h1 className="text-xl font-semibold text-gray-800 tracking-wide">{title}</h1>
  </nav>
);

export default Navbar;