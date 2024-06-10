import React from "react"
import { TailSpin } from "react-loader-spinner"

function ButtonComponent({
  id,
  color,
  onClick,
  logoComponent,
  buttonText,
  isDisabled,
  isLoading,
}: {
  id?: string
  color: string
  onClick: () => any
  logoComponent?: React.ReactNode
  buttonText: string
  isDisabled?: boolean
  isLoading?: boolean
}) {
  return (
    <div
      id={id}
      onClick={isDisabled || isLoading ? () => null : onClick}
      className={
        isDisabled || isLoading
          ? `flex items-center justify-center select-none cursor-default ${color} rounded-full text-white px-6 py-1 font-normal shadow-md shadow-gray-600 w-fit opacity-50`
          : `flex items-center justify-center select-none cursor-pointer ${color} rounded-full text-white px-6 py-1 font-normal shadow-md shadow-gray-600 w-fit`
      }>
      {isLoading ? (
        <>
          <div className="absolute">
            <TailSpin
              visible={true}
              height="16"
              width="16"
              color="#06B6D4"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
          <div className="invisible flex flex-row items-center gap-2">
            {logoComponent}
            <div className="text-md font-medium text-base">{buttonText}</div>
          </div>
        </>
      ) : (
        <>
          <div className="visible flex flex-row items-center gap-2">
            {logoComponent}
            <div className="text-md font-medium text-base">{buttonText}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default ButtonComponent
