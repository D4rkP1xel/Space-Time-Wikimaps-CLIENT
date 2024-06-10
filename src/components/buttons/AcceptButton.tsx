import ButtonComponent from "./ButtonComponent"

function AcceptButton({
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
      color={"bg-green-600"}
      onClick={onClick}
      logoComponent={logoComponent}
      buttonText={buttonText}
      isDisabled={isDisabled}
      isLoading={isLoading}
    />
  )
}

export default AcceptButton
