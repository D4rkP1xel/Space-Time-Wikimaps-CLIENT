import { Component } from "react"

function DeclineButton({
  id,
  onClick,
  logoComponent,
  buttonText,
}: {
  id?: string
  onClick: () => any
  logoComponent: React.ReactNode
  buttonText: string
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className="flex flex-row items-center gap-2 select-none cursor-pointer bg-red-600 rounded-full text-white px-6 py-1 font-normal shadow-md shadow-gray-600">
      {logoComponent}
      <div className="text-md font-medium text-base">{buttonText}</div>
    </div>
  )
}

export default DeclineButton
