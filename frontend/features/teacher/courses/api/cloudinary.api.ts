/**
 * Cloudinary direct upload helper using Unsigned Upload Preset
 */
export async function uploadImageToCloudinary(
  file: File,
  customPreset?: string
): Promise<{ url: string; publicId: string }> {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dfbsdiq9p";
  const uploadPreset =
    customPreset ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    "edu_lms";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Tải ảnh lên Cloudinary thất bại. Hãy kiểm tra Upload Preset (${uploadPreset}) trên Cloudinary.`
    );
  }

  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
  };
}
