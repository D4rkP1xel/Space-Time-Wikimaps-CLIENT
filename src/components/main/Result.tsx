import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

function Result({
  name,
  description,
  layerId,
  router,
}: {
  name: string
  description: string
  layerId: number
  router: AppRouterInstance
}) {
  return (
    <div className="block mb-12">
      <div
        onClick={() => router.push("/layer/" + layerId)}
        className="font-bold text-2xl mb-2 cursor-pointer w-fit">
        {name}
      </div>
      <div className="text-gray-500 text-base">
        {description != "" ? description : "No description"}
      </div>
    </div>
  )
}

export default Result
