import { FaSearch } from "react-icons/fa"

function Header() {
  return (
    <div className="h-20 bg-cyan-700 w-full flex items-center px-8">
      <div className="font-extrabold text-2xl text-white mr-8">WIKIMAPS</div>
      <div className="flex gap-4 bg-cyan-900 items-center py-2 pl-4 pr-1 rounded-full">
        <FaSearch color="#FFFFFF" size={16} />
        <input
          type="text"
          className="bg-cyan-900 w-80 text-white border-none outline-none"
        />
      </div>
    </div>
  )
}

export default Header
