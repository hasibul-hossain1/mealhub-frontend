import CompleteProfileForm from "./components/CompleteProfileForm"
import { extractSellerProfile, sellerService } from "@/services/seller.service"

async function CompleteProfilePage() {
  const { data } = await sellerService.getSellerProfile()
  const sellerProfile = extractSellerProfile(data)

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <CompleteProfileForm
        initialValues={{
          restaurantName: sellerProfile?.restaurantName ?? "",
          description: sellerProfile?.description ?? "",
          address: sellerProfile?.address ?? "",
          phoneNumber: sellerProfile?.phoneNumber ?? "",
        }}
      />
    </section>
  )
}

export default CompleteProfilePage
