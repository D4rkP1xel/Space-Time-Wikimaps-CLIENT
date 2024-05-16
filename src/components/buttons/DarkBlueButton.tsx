import { Component } from "react"
import { TailSpin } from "react-loader-spinner"

function DarkBlueButton({
  onClick,
  logoComponent,
  buttonText,
  isDisabled,
  isLoading,
}: {
  onClick: () => any
  logoComponent?: React.ReactNode
  buttonText: string
  isDisabled?: boolean
  isLoading?: boolean
}) {
  return (
    <div
      onClick={isDisabled ? () => null : onClick}
      className={
        isDisabled || isLoading
          ? "flex items-center justify-center select-none cursor-default bg-cyan-900 rounded-full text-white px-6 py-1 font-normal shadow-md shadow-gray-600 w-fit opacity-50"
          : "flex items-center justify-center select-none cursor-pointer bg-cyan-900 rounded-full text-white px-6 py-1 font-normal shadow-md shadow-gray-600 w-fit"
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

export default DarkBlueButton
