import Header from "@/components/main/Header"
import Map from "@/components/main/Map"
import Result from "@/components/main/Result"
function Home() {
  return (
    <>
      <Header />
      <>
        <div className="flex">
          <div
            className="flex w-full px-12 pt-12 z-0"
            style={{ width: `calc(100% - 300px)` }}>
            <div className="w-full pr-48 z-10">
              <div className="font-normal text-2xl mb-8">Results:</div>
              <div>
                <Result />
                <Result />
                <Result />
                <Result />
                <Result />
              </div>
            </div>
          </div>
          <Map />
        </div>
      </>
    </>
  )
}

export default Home
