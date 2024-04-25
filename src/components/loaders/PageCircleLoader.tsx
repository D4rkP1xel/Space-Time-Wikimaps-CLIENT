import React from "react"
import { TailSpin } from "react-loader-spinner"

function PageCircleLoader() {
  return (
    <div className="flex justify-center mt-12">
      <TailSpin
        visible={true}
        height="48"
        width="48"
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}

export default PageCircleLoader
