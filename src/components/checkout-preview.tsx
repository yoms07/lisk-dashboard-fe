import {
  BusinessProfile,
  CheckoutUiCustomization,
} from "@/lib/api/business_profile/schema";

interface CheckoutPreviewProps {
  customization: CheckoutUiCustomization;
  businessProfile: BusinessProfile;
}

export function CheckoutPreview({
  customization,
  businessProfile,
}: CheckoutPreviewProps) {
  return (
    <div
      className="p-6 rounded-lg shadow-lg"
      style={{
        backgroundColor: customization.backgroundColor,
        color: customization.textColor,
        borderRadius: customization.borderRadius,
        fontFamily: customization.fontFamily,
      }}
    >
      <div className="space-y-6">
        {customization.showBusinessName && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {businessProfile.business_name}
            </h2>
          </div>
        )}

        {customization.showBusinessDescription && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {businessProfile.business_description}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
              style={{
                backgroundColor: customization.backgroundColor,
                color: customization.textColor,
                borderColor: customization.primaryColor,
                borderRadius: customization.borderRadius,
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter description"
              style={{
                backgroundColor: customization.backgroundColor,
                color: customization.textColor,
                borderColor: customization.primaryColor,
                borderRadius: customization.borderRadius,
              }}
            />
          </div>

          <button
            className="w-full p-2 text-white rounded"
            style={{
              backgroundColor: customization.primaryColor,
              borderRadius: customization.borderRadius,
            }}
          >
            Pay Now
          </button>
        </div>

        {customization.showPoweredBy && (
          <div className="text-center text-xs text-muted-foreground">
            Powered by Lisk PG
          </div>
        )}
      </div>
    </div>
  );
}
