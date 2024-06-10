import { Component } from "react"
import ButtonComponent from "./ButtonComponent"

function DeclineButton({
  id,
  onClick,
  logoComponent,
  buttonText,
  isDisabled,
  isLoading,
}: {
  id?: string
  onClick: () => any
  logoComponent?: React.ReactNode
  buttonText: string
  isDisabled?: boolean
  isLoading?: boolean
}) {
  return (
    <ButtonComponent
      id={id}
      color={"bg-red-600"}
      onClick={onClick}
      logoComponent={logoComponent}
      buttonText={buttonText}
      isDisabled={isDisabled}
      isLoading={isLoading}
    />
  )
}

export default DeclineButton
