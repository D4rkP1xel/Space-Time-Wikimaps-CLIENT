import { Component } from "react"

function EditButton({
  onClick,
  logoComponent,
  buttonText,
}: {
  onClick: () => any
  logoComponent: React.ReactNode
  buttonText: string
}) {
  return (
    <div
      onClick={onClick}
      className="flex flex-row items-center gap-2 select-none cursor-pointer bg-yellow-400 rounded-full text-white px-6 py-1 font-normal shadow-md shadow-gray-600">
      {logoComponent}
      <div className="text-md font-medium text-base">{buttonText}</div>
    </div>
  )
}

export default EditButton
