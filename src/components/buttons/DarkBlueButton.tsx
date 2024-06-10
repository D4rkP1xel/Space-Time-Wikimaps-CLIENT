import { TailSpin } from "react-loader-spinner"
import ButtonComponent from "./ButtonComponent"

function DarkBlueButton({
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
      color={"bg-cyan-900"}
      onClick={onClick}
      logoComponent={logoComponent}
      buttonText={buttonText}
      isDisabled={isDisabled}
      isLoading={isLoading}
    />
  )
}

export default DarkBlueButton
